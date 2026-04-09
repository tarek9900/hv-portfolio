"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ArtworkColumnLayout, ArtworkDisplayType, ArtworkItem } from "@/lib/types";

type AuthState = "loading" | "authenticated" | "anonymous";

type ProjectDraft = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  category: "drawing" | "sculptures";
  media: string[];
  displayType: ArtworkDisplayType;
  columnLayout: ArtworkColumnLayout;
  portfolio_order: number;
  show_in_portfolio: boolean;
  active: boolean;
};

const emptyDraft: ProjectDraft = {
  title: "",
  slug: "",
  description: "",
  category: "drawing",
  media: [],
  displayType: "single",
  columnLayout: 3,
  portfolio_order: 0,
  show_in_portfolio: true,
  active: false
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeImagePath(value: string): string {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:") || value.startsWith("data:")) {
    return value;
  }
  return value.startsWith("/") ? value : `/${value}`;
}

function toDraft(item: ArtworkItem): ProjectDraft {
  const media = item.media?.length ? item.media : item.detail_images?.length ? item.detail_images : item.thumbnail ? [item.thumbnail] : [];
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description || "",
    category: item.category,
    media,
    displayType: item.displayType || (item.detail_template === "carousel" ? "carousel" : "single"),
    columnLayout: item.columnLayout || (item.detail_template === "gallery4" ? 4 : item.detail_template === "single" ? 1 : 3),
    portfolio_order: item.portfolio_order,
    show_in_portfolio: item.show_in_portfolio,
    active: item.active
  };
}

function toApiPayload(draft: ProjectDraft, publish: boolean): Record<string, unknown> {
  const media = draft.media.filter(Boolean);
  return {
    id: draft.id,
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    description: draft.description.trim(),
    category: draft.category,
    media,
    displayType: draft.displayType,
    columnLayout: draft.columnLayout,
    // Backward-compatible fields used by existing public pages.
    thumbnail: media[0] || "",
    detail_images: media,
    detail_template: draft.displayType === "carousel" ? "carousel" : "single",
    detail_url: "",
    portfolio_order: draft.portfolio_order,
    show_in_portfolio: draft.show_in_portfolio,
    show_on_home: false,
    home_order: 0,
    home_image: "",
    home_image_style: "",
    active: publish
  };
}

async function uploadSingleImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch("/api/admin/upload", { method: "POST", body });
  if (!response.ok) {
    const data = (await response.json()) as { message?: string };
    throw new Error(data.message || "Image upload failed");
  }

  const data = (await response.json()) as { path: string };
  return data.path;
}

function MediaReorderList({
  media,
  onChange
}: {
  media: string[];
  onChange: (next: string[]) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function moveItem(from: number, to: number) {
    const next = [...media];
    const [picked] = next.splice(from, 1);
    next.splice(to, 0, picked);
    onChange(next);
  }

  if (media.length === 0) {
    return <p className="text-sm text-zinc-500">No media yet. Upload images to start.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {media.map((src, index) => (
        <div
          key={`${src}-${index}`}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (dragIndex === null || dragIndex === index) return;
            moveItem(dragIndex, index);
            setDragIndex(null);
          }}
          onDragEnd={() => setDragIndex(null)}
          className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm"
        >
          <img src={normalizeImagePath(src)} alt={`Media ${index + 1}`} className="h-40 w-full rounded-lg object-cover" />
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-500">Drag to reorder</span>
            <button
              type="button"
              onClick={() => onChange(media.filter((_, i) => i !== index))}
              className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewPanel({ draft }: { draft: ProjectDraft }) {
  const media = draft.media.slice(0, draft.columnLayout === 4 ? 16 : draft.columnLayout === 3 ? 9 : 1);

  return (
    <aside className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
      <h2 className="text-lg font-semibold text-zinc-900">Preview</h2>
      <p className="mt-1 text-sm text-zinc-500">Public overview + project media behavior before saving.</p>

      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Overview Grid ({draft.columnLayout} columns)</p>
          {/* Grid preview uses the selected column layout to match portfolio overview rendering. */}
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${draft.columnLayout}, minmax(0, 1fr))` }}
          >
            {media.length > 0 ? (
              media.map((src, index) => (
                <img
                  key={`${src}-${index}`}
                  src={normalizeImagePath(src)}
                  alt={`Grid ${index + 1}`}
                  className="aspect-square w-full rounded-md object-cover"
                />
              ))
            ) : (
              <div className="col-span-full rounded-md border border-dashed border-zinc-300 p-4 text-center text-sm text-zinc-500">
                Upload media to preview the grid.
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Project Display ({draft.displayType})</p>
          {/* Single shows first image; carousel shows horizontal list to simulate sliding media. */}
          {draft.displayType === "single" ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
              {draft.media[0] ? (
                <img src={normalizeImagePath(draft.media[0])} alt="Featured" className="h-56 w-full rounded-md object-cover" />
              ) : (
                <div className="h-56 rounded-md border border-dashed border-zinc-300 text-sm text-zinc-500 grid place-items-center">No featured image</div>
              )}
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-2">
              {draft.media.length > 0 ? (
                draft.media.map((src, index) => (
                  <img key={`${src}-${index}`} src={normalizeImagePath(src)} alt={`Slide ${index + 1}`} className="h-40 w-52 flex-none rounded-md object-cover" />
                ))
              ) : (
                <div className="h-40 w-full rounded-md border border-dashed border-zinc-300 text-sm text-zinc-500 grid place-items-center">No carousel images</div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default function AdminPage() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<ArtworkItem[]>([]);
  const [draft, setDraft] = useState<ProjectDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.portfolio_order - b.portfolio_order || a.id.localeCompare(b.id)),
    [items]
  );

  async function loadItems() {
    const response = await fetch("/api/admin/items", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load projects");
    const data = (await response.json()) as { items: ArtworkItem[] };
    setItems(data.items);
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

  useEffect(() => {
    function syncFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const editId = params.get("edit");

      if (!editId) {
        setEditingId(null);
        setDraft(emptyDraft);
        return;
      }

      const target = items.find((item) => item.id === editId);
      if (!target) {
        return;
      }

      setEditingId(target.id);
      setDraft(toDraft(target));
    }

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [items]);

  function setEditorUrl(editId: string | null, mode: "push" | "replace" = "replace") {
    const target = editId ? `/admin?edit=${encodeURIComponent(editId)}` : "/admin";
    if (mode === "push") {
      window.history.pushState(null, "", target);
      return;
    }
    window.history.replaceState(null, "", target);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setError("Invalid password");
      return;
    }

    setAuthState("authenticated");
    setPassword("");
    await loadItems();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthState("anonymous");
    setItems([]);
  }

  async function handleUploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (list.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploaded = await Promise.all(list.map((file) => uploadSingleImage(file)));
      setDraft((prev) => ({ ...prev, media: [...prev.media, ...uploaded] }));
      setNotice(`${uploaded.length} image(s) uploaded.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function saveProject(publish: boolean) {
    if (!draft.title.trim()) {
      setError("Project title is required");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = toApiPayload(draft, publish);
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `/api/admin/items/${editingId}` : "/api/admin/items";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(editingId ? "Update failed" : "Create failed");
      }

      await loadItems();
      setDraft(emptyDraft);
      setEditingId(null);
      setEditorUrl(null, "replace");
      setNotice(publish ? "Project published." : "Draft saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(id: string) {
    if (!window.confirm("Delete this project?")) return;

    const response = await fetch(`/api/admin/items/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Delete failed");
      return;
    }

    setNotice("Project deleted.");
    await loadItems();
    if (editingId === id) {
      setEditingId(null);
      setDraft(emptyDraft);
      setEditorUrl(null, "replace");
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
          <p className="mt-1 text-sm text-zinc-500">Sign in to manage projects and media.</p>
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

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Project Media Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">Upload media, choose single/carousel display, and configure 3 or 4 column public layout.</p>
          </div>
          <button onClick={handleLogout} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">Logout</button>
        </header>

        {notice ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p> : null}
        {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <div className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-zinc-900">{editingId ? "Edit Project" : "New Project"}</h2>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setDraft(emptyDraft);
                    setEditingId(null);
                    setEditorUrl(null, "replace");
                  }}
                  className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                >
                  Clear editor
                </button>
              ) : null}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-zinc-700">
                Title
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
              </label>

              <label className="text-sm text-zinc-700">
                Slug
                <input
                  value={draft.slug}
                  onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))}
                  placeholder={slugify(draft.title)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
              </label>
            </div>

            <label className="mt-3 block text-sm text-zinc-700">
              Description
              <textarea
                value={draft.description}
                onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
                className="mt-1 min-h-24 w-full rounded-lg border border-zinc-300 px-3 py-2"
              />
            </label>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="text-sm text-zinc-700">
                Category
                <select
                  value={draft.category}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, category: event.target.value === "sculptures" ? "sculptures" : "drawing" }))
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                >
                  <option value="drawing">Drawings & Collages</option>
                  <option value="sculptures">Sculptures</option>
                </select>
              </label>

              <label className="text-sm text-zinc-700">
                Display Type
                <select
                  value={draft.displayType}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, displayType: event.target.value === "carousel" ? "carousel" : "single" }))
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                >
                  <option value="single">Single</option>
                  <option value="carousel">Carousel</option>
                </select>
              </label>

              <label className="text-sm text-zinc-700">
                Column Layout
                <select
                  value={String(draft.columnLayout)}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      columnLayout: event.target.value === "4" ? 4 : event.target.value === "3" ? 3 : 1
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                >
                  <option value="1">1x1 Single</option>
                  <option value="3">3x3 Grid</option>
                  <option value="4">4x4 Grid</option>
                </select>
              </label>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-zinc-300 p-4">
              <p className="text-sm font-medium text-zinc-700">Media Upload Zone</p>
              <p className="text-xs text-zinc-500">Drop multiple images here or choose files.</p>
              <div
                className="mt-3 rounded-lg border border-zinc-300 bg-zinc-50 p-4 text-center"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  void handleUploadFiles(event.dataTransfer.files);
                }}
              >
                <p className="text-sm text-zinc-600">Drag and drop images</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={uploading}
                  onChange={(event) => {
                    const files = event.target.files;
                    if (files && files.length > 0) {
                      void handleUploadFiles(files);
                    }
                  }}
                  className="mx-auto mt-2 block text-xs text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
                />
                {uploading ? <p className="mt-2 text-xs text-zinc-500">Uploading...</p> : null}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-zinc-700">Media Order (drag and drop)</p>
              <MediaReorderList media={draft.media} onChange={(next) => setDraft((prev) => ({ ...prev, media: next }))} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveProject(false)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-60"
              >
                Save Draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveProject(true)}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                Publish
              </button>
            </div>
          </section>

          <PreviewPanel draft={draft} />
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Projects ({sortedItems.length})</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {sortedItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-zinc-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
                    <p className="text-xs text-zinc-500">{item.category} • {item.displayType || "single"} • {item.columnLayout || 3} cols</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>
                    {item.active ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(item.id);
                      setDraft(toDraft(item));
                      setEditorUrl(item.id, "push");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteProject(item.id)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
