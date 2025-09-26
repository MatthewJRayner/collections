"use client";

import React, { useState } from "react";

type Track = {
  track_number: number;
  title: string;
  lyrics?: string;
  length?: string;
};

type Props = {
  tracklist: Track[];
  setTracklist: (t: Track[]) => void;
};

export default function TracklistEditor({ tracklist, setTracklist }: Props) {
  const [tracksView, setTracksView] = useState(false);

  const addTrack = () => {
    const nextNumber = tracklist.length + 1;
    setTracklist([
      ...tracklist,
      { track_number: nextNumber, title: "", lyrics: "", length: "0:00" },
    ]);
  };

  const updateTrack = (index: number, field: keyof Track, value: string) => {
    const updated = [...tracklist];
    if (field === "title" || field === "lyrics" || field === "length") {
      updated[index][field] = value;
    } else if (field === "track_number") {
      updated[index][field] = Number(value) as number;
    }
    setTracklist(updated);
  };

  const removeTrack = (index: number) => {
    const updated = tracklist.filter((_, i) => i !== index);
    setTracklist(updated.map((t, i) => ({ ...t, track_number: i + 1 })));
  };

  return (
    <div className="px-2 py-3 rounded bg-neutral shadow w-full">
      <button
        type="button"
        className="mb-2 w-full text-left cursor-pointer"
        onClick={() => setTracksView(!tracksView)}
      >
        <span className={`mr-1 transition ${tracksView ? "text-primary" : ""}`}>
          Tracklist
        </span>
        <span
          className={`transition duration-400 ${
            tracksView ? "text-primary" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {tracksView && (
        <>
          {tracklist.map((track: Track, index: number) => (
            <div key={index} className="mb-3 bg-background shadow p-2 rounded">
              <input
                type="text"
                placeholder="Track Title"
                value={track.title}
                onChange={(e) => updateTrack(index, "title", e.target.value)}
                className="bg-background text-sm sm:text-base border-foreground border-b-1 p-1 w-full mb-3"
              />
              <input
                type="text"
                placeholder="Length"
                value={track.length || ""}
                onChange={(e) => updateTrack(index, "length", e.target.value)}
                className="bg-background text-sm sm:text-base border-foreground border-b-1 p-1 w-full mb-3"
              />
              <textarea
                placeholder="Lyrics (optional)"
                value={track.lyrics || ""}
                onChange={(e) => updateTrack(index, "lyrics", e.target.value)}
                className="bg-background text-sm sm:text-base border-foreground border-b-1 p-1 w-full mb-1"
              />
              <button
                type="button"
                onClick={() => removeTrack(index)}
                className="bg-danger text-sm sm:text-base text-white px-2 py-1 rounded cursor-pointer hover:bg-red-500 transition"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTrack}
            className="bg-primary text-sm sm:text-base text-white hover:scale-105 hover:text-background hover:bg-neutral-mid transition cursor-pointer px-3 py-1 rounded"
          >
            + Add Track
          </button>
        </>
      )}
    </div>
  );
}
