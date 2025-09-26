"use client";

import React, { useEffect, useState } from "react";
import { Clothing } from "@/types/clothing";
import ClothesCard from "@/components/wardrobe/ClothesCard";
import { formatPhrase } from "@/utils/formatters";
import Link from "next/link";

export default function ClothesPage() {
  const [clothes, setClothes] = useState<Clothing[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClothes = clothes.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.brands?.toLowerCase().includes(query) ||
      c.style?.toLowerCase().includes(query) ||
      c.type?.toLowerCase().includes(query) ||
      c.category?.toLowerCase().includes(query)
    );
  });

  const fetchClothes = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/wardrobe/")
      .then((response) => response.json())
      .then((data) => {
        setClothes(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  const deleteClothing = async (id: number) => {
    if (!confirm("Are you sure you want to delete this clothing item")) return;

    await fetch(`http://127.0.0.1:8000/api/wardrobe/${id}/`, {
      method: "DELETE",
    });
    fetchClothes();
  };

  const groupByCategory = React.useMemo(
    () =>
      filteredClothes.reduce<Record<string, Clothing[]>>((acc, item) => {
        const cat = item.category || "Unknown";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      }, {}),
    [filteredClothes]
  );

  const groupByType = filteredClothes.reduce<Record<string, Clothing[]>>(
    (acc, item) => {
      const type = item.type || "Unknown";
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    },
    {}
  );

  // Stats
  const totalOwned = clothes.filter((c) => c.owned).length;
  const totalOwnedValue = Number(
    clothes
      .filter((c) => c.owned)
      .reduce((sum, c) => sum + Number(c.price || 0), 0)
  );
  const totalValue = clothes.reduce((sum, c) => sum + Number(c.price || 0), 0);
  const avgPrice =
    clothes.length > 0 ? Number(totalValue / clothes.length).toFixed(0) : 0;

  return (
    <div className="p-4 sm:p-6 flex flex-col w-full min-h-screen">
      <div className="flex justify-center sm:justify-start items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Wardrobe</h1>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:space-x-4 w-full">
        <div className="flex flex-col w-full md:w-8/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full sm:w-1/2 md:w-1/3 bg-neutral rounded shadow"
            />
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Link
                href="/wardrobe/new"
                className="bg-primary text-white px-2 py-1 hover:text-background hover:bg-neutral-mid hover:scale-105 transition rounded-md"
              >
                +
              </Link>
            </div>
          </div>
          <div className="">
            {loading ? (
              <p>Loading wardrobe...</p>
            ) : filteredClothes.length === 0 ? (
              <p>No wardrobe items found.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupByCategory).map(([cat, items]) => (
                  <div key={cat}>
                    <button
                      onClick={() =>
                        setOpenCategories((prev) => ({
                          ...prev,
                          [cat]: !prev[cat],
                        }))
                      }
                      className="w-full cursor-pointer flex justify-between items-center transition"
                    >
                      <span
                        className={`font-semibold transition ${
                          openCategories[cat] ? "text-primary" : ""
                        }`}
                      >
                        {formatPhrase(cat)}
                      </span>
                      <span
                        className={`transition duration-400 ${
                          openCategories[cat]
                            ? "text-primary transform rotate-180"
                            : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    {openCategories[cat] && (
                      <div className="ml-4">
                        {Object.entries(groupByType).map(([type]) => (
                          <div
                            key={type}
                            className="flex flex-col l-4 space-y-6"
                          >
                            <h3 className="text-lf font-semibold mb-2">
                              {type}
                            </h3>
                            <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                              {items.map((item) => (
                                <ClothesCard
                                  key={item.id}
                                  clothing={item}
                                  onDelete={deleteClothing}
                                />
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-2/10">
          <div className="bg-neutral shadow-lg h-fit rounded">
            <div className="pt-4 w-full flex justify-start pl-4">
              <span className="font-bold">Stats</span>
            </div>
            <div className="grid grid-cols-1 mb-6 mt-4 border-b-2 border-b-background/20">
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">Owned</h3>
                <p className="font-bold text-xl">{totalOwned}</p>
              </div>
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">Owned Value</h3>
                <p
                  className={`font-bold flex items-center ${
                    totalOwnedValue > 5 ? "text-md" : "text-lg"
                  }`}
                >
                  {totalOwnedValue
                    ? `£${totalOwnedValue.toLocaleString()}`
                    : "£0"}
                </p>
              </div>
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">Total Value</h3>
                <p
                  className={`font-bold flex items-center ${
                    totalValue > 5 ? "text-md" : "text-lg"
                  }`}
                >
                  {totalValue ? `£${totalValue.toLocaleString()}` : ""}
                </p>
              </div>
              <div className="rounded flex space-x-2 items-center w-full justify-between px-4 py-2">
                <h3 className="text-sm font-source font-light">
                  Average Price
                </h3>
                <p
                  className={`font-bold flex items-center ${
                    Number(avgPrice) > 5 ? "text-md" : "text-lg"
                  }`}
                >
                  {avgPrice ? `£${Number(avgPrice).toLocaleString()}` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
