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
    { name: "Instruments", path: "/instruments"},
    { name: "Extras", path: "/extras" },
  ];

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome back, <span className="text-primary">Matthew</span>.</h1>
      <p>Use this site to expand upon all your collection dreams to your heart&apos;s content.</p>
      <p>Feel free to use the navbar above or the helpful button below to navigate to the different sections.</p>
      <div className="grid gap-12 grid-cols-3 w-full p-12">
        {collections.map((c) => (
          <Link
            key={c.path}
            href={c.path}
            className="bg-neutral rounded-lg shadow active:scale-95 hover:shadow-lg hover:scale-101 hover:bg-neutral-mid hover:text-background transition duration-300 p-6 flex items-center justify-center text-lg font-semibold"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}