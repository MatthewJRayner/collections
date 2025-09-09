"use client";

import Link from "next/link";

export default function HomePage() {
  const collections = [
    { name: "Watches", path: "/watches" },
    { name: "Music", path: "/music" },
    { name: "Films", path: "/films" },
    { name: "Books", path: "/books" },
    { name: "Wardrobe", path: "/wardrobe" },
    { name: "Games", path: "/games" },
    { name: "Art", path: "/art" },
    { name: "Extras", path: "/extras" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">My Collections</h1>
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {collections.map((c) => (
          <Link
            key={c.path}
            href={c.path}
            className="border rounded-lg shadow hover:shadow-lg transition p-6 flex items-center justify-center text-lg font-semibold"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}