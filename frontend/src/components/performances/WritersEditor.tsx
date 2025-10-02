"use client";

import React, { useState } from "react";

interface Writer {
  name: string;
  role: string;
}

interface Props {
  writers: Writer[];
  setWriters: (w: Writer[]) => void;
}

export default function WritersEditor({ writers, setWriters }: Props) {
  const [writerView, setWriterView] = useState(false);

  const commonRoles = [
    "librettist",
    "playwright",
    "book writer",
    "lyricist",
    "poet",
    "scenario writer",
    "writer",
  ];

  const addWriter = () => {
    setWriters([...writers, { name: "", role: "" }]);
  };

  const updateWriter = (index: number, field: keyof Writer, value: string) => {
    const updated = [...writers];
    updated[index][field] = value;
    setWriters(updated);
  };

  const removeWriter = (index: number) => {
    setWriters(writers.filter((_, i) => i !== index));
  };

  return (
    <div className="p-2 sm:p-3 rounded bg-neutral shadow w-full">
      <button
        type="button"
        className="mb-2 w-full text-left text-xs sm:text-sm cursor-pointer flex items-center"
        onClick={() => setWriterView(!writerView)}
      >
        <span className={`mr-1 transition ${writerView ? "text-primary" : ""}`}>
          Writers
        </span>
        <span
          className={`transition duration-300 ${writerView ? "text-primary rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      {writerView && (
        <div className="space-y-3">
          {writers.map((writer, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 items-start">
              <input
                type="text"
                placeholder="Writer Name (e.g., Lorenzo Da Ponte)"
                value={writer.name}
                onChange={(e) => updateWriter(index, "name", e.target.value)}
                className="bg-background border-b border-neutral/50 p-1.5 w-full sm:flex-1 text-base focus:outline-none focus:ring-2 focus:ring-primary touch-action-manipulation"
              />
              <select
                value={writer.role}
                onChange={(e) => updateWriter(index, "role", e.target.value)}
                className="bg-background border-b border-neutral/50 p-1.5 w-full sm:w-1/3 text-base focus:outline-none focus:ring-2 focus:ring-primary touch-action-manipulation"
              >
                <option value="">Select Role</option>
                {commonRoles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
                <option value="custom">Custom Role</option>
              </select>
              {writer.role === "custom" && (
                <input
                  type="text"
                  placeholder="Custom Role"
                  value={writer.role === "custom" ? "" : writer.role}
                  onChange={(e) => updateWriter(index, "role", e.target.value)}
                  className="bg-background border-b border-neutral/50 p-1.5 w-full sm:w-1/3 text-base focus:outline-none focus:ring-2 focus:ring-primary touch-action-manipulation"
                />
              )}
              <button
                type="button"
                onClick={() => removeWriter(index)}
                className="bg-danger text-white px-2 py-1 text-xs sm:text-sm hover:bg-red-500 transition cursor-pointer active:scale-95"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addWriter}
            className="bg-primary text-white px-2 py-1.5 rounded text-xs sm:text-base hover:bg-neutral-mid transition cursor-pointer active:scale-95"
          >
            + Add Writer
          </button>
        </div>
      )}
    </div>
  );
}