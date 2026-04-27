"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ArtworkItem } from "@/lib/types";

type AuthState = "loading" | "authenticated" | "anonymous";
type SlotKey = "first" | "second";

type HomeSlot = {
  projectId: string;
  image: string;
};

type HomeState = {
  first: HomeSlot;
  second: HomeSlot;
};

const emptySlot: HomeSlot = { projectId: "", image: "" };

function normalizeImagePath(value: string): string {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return value.startsWith("/") ? value : `/${value}`;
}

function uniqueImages(item: ArtworkItem | undefined): string[] {
  if (!item) return [];
  const candidates = [item.hero_image, item.thumbnail, ...(item.media ?? []), ...(item.detail_images ?? [])]
    .map((entry) => (entry || "").trim())
    .filter(Boolean);
  return Array.from(new Set(candidates));
}

function initialHomeState(items: ArtworkItem[]): HomeState {
  const featured = [...items]
    .filter((item) => item.active && item.show_on_home)
    .sort((a, b) => a.home_order - b.home_order || a.portfolio_order - b.portfolio_order);

  const first = featured[0];
  const second = featured[1];

  return {
    first: first
      ? {
          projectId: first.id,
          image: first.home_image || first.hero_image || first.thumbnail || first.media?.[0] || ""
        }
      : emptySlot,
    second: second
      ? {
          projectId: second.id,
          image: second.home_image || second.hero_image || second.thumbnail || second.media?.[0] || ""
        }
      : emptySlot
  };
}

export default function AdminHomePage() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<ArtworkItem[]>([]);
  const [home, setHome] = useState<HomeState>({ first: emptySlot, second: emptySlot });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.portfolio_order - b.portfolio_order || a.title.localeCompare(b.title)),
    [items]
  );

  async function loadItems() {
    const response = await fetch("/api/admin/items", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Could not load projects");
    }
    const data = (await response.json()) as { items: ArtworkItem[] };
    setItems(data.items);
    setHome(initialHomeState(data.items));
  }

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        const data = (await response.json()) as { authenticated: boolean };
        if (cancelled) return;

        if (!data.authenticated) {
          setAuthState("anonymous");
          return;
        }

        setAuthState("authenticated");
        await loadItems();
      } catch {
        if (!cancelled) setAuthState("anonymous");
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  function syncSlot(slot: SlotKey, projectId: string) {
    const selected = sortedItems.find((item) => item.id === projectId);
    const images = uniqueImages(selected);

    setHome((prev) => ({
      ...prev,
      [slot]: {
        projectId,
        image: images[0] || ""
      }
    }));
  }

  function updateSlotImage(slot: SlotKey, image: string) {
    setHome((prev) => ({
      ...prev,
      [slot]: { ...prev[slot], image }
    }));
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setError("Invalid password");
      return;
    }

    setPassword("");
    setAuthState("authenticated");
    await loadItems();
  }

  async function handleSave() {
    setError("");
    setNotice("");

    if (!home.first.projectId || !home.second.projectId) {
      setError("Select both first and second homepage photos.");
      return;
    }

    if (home.first.projectId === home.second.projectId) {
      setError("First and second photos must use two different projects.");
      return;
    }

    if (!home.first.image || !home.second.image) {
      setError("Select an image for both slots.");
      return;
    }

    setSaving(true);
    try {
      const updates = sortedItems.map((item) => {
        if (item.id === home.first.projectId) {
          return {
            id: item.id,
            payload: { show_on_home: true, home_order: 1, home_image: home.first.image }
          };
        }
        if (item.id === home.second.projectId) {
          return {
            id: item.id,
            payload: { show_on_home: true, home_order: 2, home_image: home.second.image }
          };
        }
        return {
          id: item.id,
          payload: { show_on_home: false, home_order: 0 }
        };
      });

      // Sequential writes prevent overlapping JSON file writes on disk.
      for (const entry of updates) {
        const response = await fetch(`/api/admin/items/${entry.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry.payload)
        });
        if (!response.ok) {
          throw new Error(`Failed updating item ${entry.id}`);
        }
      }

      await loadItems();
      setNotice("Homepage photos updated.");
    } catch {
      setError("Could not save homepage photos.");
    } finally {
      setSaving(false);
    }
  }

  if (authState === "loading") {
    return <div className="min-h-screen bg-zinc-50 p-6 text-zinc-700">Loading admin...</div>;
  }

  if (authState === "anonymous") {
    return (
      <div className="min-h-screen bg-zinc-100 p-4 sm:p-8">
        <form onSubmit={handleLogin} className="mx-auto mt-20 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Portfolio Admin</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in to manage homepage photos.</p>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-4 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-0 focus:border-zinc-500"
            placeholder="Password"
            required
          />
          <button className="mt-4 w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800">Sign in</button>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        </form>
      </div>
    );
  }

  function renderSlot(slot: SlotKey, title: string) {
    const value = home[slot];
    const selectedProject = sortedItems.find((item) => item.id === value.projectId);
    const imageOptions = uniqueImages(selectedProject);

    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>

        <label className="mt-4 block text-sm text-zinc-700">
          Project
          <select
            value={value.projectId}
            onChange={(event) => syncSlot(slot, event.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
          >
            <option value="">Select project</option>
            {sortedItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.category})
              </option>
            ))}
          </select>
        </label>

        <label className="mt-3 block text-sm text-zinc-700">
          Photo
          <select
            value={value.image}
            onChange={(event) => updateSlotImage(slot, event.target.value)}
            disabled={!value.projectId}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 disabled:bg-zinc-100"
          >
            <option value="">Select image</option>
            {imageOptions.map((image) => (
              <option key={image} value={image}>
                {image.split("/").pop()}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          {value.image ? (
            <img src={normalizeImagePath(value.image)} alt={`${title} preview`} className="aspect-[16/10] w-full rounded-lg object-cover" />
          ) : (
            <div className="grid aspect-[16/10] w-full place-items-center rounded-lg border border-dashed border-zinc-300 text-sm text-zinc-500">
              No image selected
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Homepage Photos</h1>
            <p className="mt-1 text-sm text-zinc-500">Pick the first and second image displayed on the home page.</p>
          </div>
          <Link href="/admin" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
            Back to projects
          </Link>
        </header>

        {notice ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p> : null}
        {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <div className="grid gap-5 lg:grid-cols-2">
          {renderSlot("first", "1st Photo")}
          {renderSlot("second", "2nd Photo")}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save homepage photos"}
          </button>
        </div>
      </div>
    </div>
  );
}
