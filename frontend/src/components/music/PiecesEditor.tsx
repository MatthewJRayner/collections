"use client";

import React, { useState } from "react";

type Piece = {
    title: string;
    composer: string;
    movements?: string[];
}

type Props = {
  pieces: Piece[];
  setPieces: (p: Piece[]) => void;
};

export default function PiecesEditor({ pieces, setPieces }: Props) {
  const [pieceView, setPiecesView] = useState(false);

  const addMember = () => setPieces([...pieces, { title: "", composer: "", movements: [] }]);

  const updateMember = (index: number, field: keyof Piece, value: string) => {
    const updated = [...pieces];
    if (field === "movements") {
      updated[index].movements = value.split(",").map(m => m.trim());
    } else {
      updated[index][field] = value;
    }
    setPieces(updated);
  };

  const removeMember = (index: number) => {
    setPieces(pieces.filter((_, i) => i !== index));
  };

  return (
    <div className="p-2 rounded bg-neutral shadow w-full">
      <button
        type="button"
        className="mb-2 w-full text-left text-xs sm:text-sm cursor-pointer"
        onClick={() => setPiecesView(!pieceView)}
      >
        <span className={`mr-1 transition ${pieceView ? "text-primary" : ""}`}>
          Pieces
        </span>
        <span
          className={`transition duration-400 ${
            pieceView ? "text-primary" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {pieceView && (
        <>
          {pieces.map((member, index) => (
            <div key={index} className="mb-3 bg-background shadow p-2 rounded">
              <input
                type="text"
                placeholder="Title"
                value={member.title}
                onChange={(e) => updateMember(index, "title", e.target.value)}
                className="bg-background border-foreground border-b-1 p-1 w-full text-sm sm:text-base mb-2"
              />
              <input
                type="text"
                placeholder="Composer"
                value={member.composer}
                onChange={(e) => updateMember(index, "composer", e.target.value)}
                className="bg-background border-foreground border-b-1 p-1 w-full text-sm sm:text-base"
              />
              
              <input
                type="text"
                placeholder="Movements"
                value={member.movements}
                onChange={(e) => updateMember(index, "movements", e.target.value)}
                className="bg-background border-foreground border-b-1 p-1 w-full text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => removeMember(index)}
                className="bg-danger text-white px-2 py-1 mt-2 text-sm sm:text-base hover:text-background hover:bg-red-500 transition cursor-pointer active:scale-95"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMember}
            className="bg-primary text-sm sm:text-base text-white px-2 py-2 rounded hover:text-background hover:bg-neutral-mid transition cursor-pointer active:scale-95"
          >
            + Add Piece
          </button>
        </>
      )}
    </div>
  );
}
