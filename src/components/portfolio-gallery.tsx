"use client";

import { useMemo, useState } from "react";
import { ArtCard } from "@/components/art-card";
import { ArtworkItem } from "@/lib/types";

type Filter = "all" | "drawing" | "sculptures";

export function PortfolioGallery({ items }: { items: ArtworkItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") {
      return items;
    }
    return items.filter((item) => item.category === filter);
  }, [filter, items]);

  return (
    <>
      <div className="filter-bar">
        <button className={`filter-button ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All
        </button>
        <button
          className={`filter-button ${filter === "drawing" ? "active" : ""}`}
          onClick={() => setFilter("drawing")}
        >
          Drawings & Collages
        </button>
        <button
          className={`filter-button ${filter === "sculptures" ? "active" : ""}`}
          onClick={() => setFilter("sculptures")}
        >
          Sculptures
        </button>
      </div>

      <div className="gallery-grid">
        {filtered.map((item) => (
          <ArtCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
