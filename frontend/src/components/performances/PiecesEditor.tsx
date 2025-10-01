"use client";

import React, { useState } from "react";

interface Movement {
  number: string;
  title: string;
}

interface Piece {
  title: string;
  composer: string;
  movements: Movement[];
}

interface Props {
  pieces: Piece[];
  setPieces: (p: Piece[]) => void;
}

export default function PiecesEditor({ pieces, setPieces }: Props) {
  const [pieceView, setPieceView] = useState(false);

  const addPiece = () => {
    setPieces([...pieces, { title: "", composer: "", movements: [] }]);
  };

  const updatePiece = (index: number, field: keyof Omit<Piece, "movements">, value: string) => {
    const updated = [...pieces];
    updated[index][field] = value;
    setPieces(updated);
  };

  const addMovement = (pieceIndex: number) => {
    const updated = [...pieces];
    updated[pieceIndex].movements = [
      ...updated[pieceIndex].movements,
      { number: "", title: "" },
    ];
    setPieces(updated);
  };

  const updateMovement = (
    pieceIndex: number,
    movementIndex: number,
    field: keyof Movement,
    value: string
  ) => {
    const updated = [...pieces];
    updated[pieceIndex].movements[movementIndex][field] = value;
    setPieces(updated);
  };

  const removeMovement = (pieceIndex: number, movementIndex: number) => {
    const updated = [...pieces];
    updated[pieceIndex].movements = updated[pieceIndex].movements.filter(
      (_, i) => i !== movementIndex
    );
    setPieces(updated);
  };

  const removePiece = (index: number) => {
    setPieces(pieces.filter((_, i) => i !== index));
  };

  return (
    <div className="p-2 sm:p-3 rounded bg-neutral shadow w-full">
      <button
        type="button"
        className="mb-2 w-full text-left text-xs sm:text-sm cursor-pointer flex items-center"
        onClick={() => setPieceView(!pieceView)}
      >
        <span className={`mr-1 transition ${pieceView ? "text-primary" : ""}`}>
          Pieces
        </span>
        <span
          className={`transition duration-300 ${pieceView ? "text-primary rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      {pieceView && (
        <div className="space-y-3">
          {pieces.map((piece, pieceIndex) => (
            <div key={pieceIndex} className="mb-3 bg-background shadow p-2 sm:p-3 rounded">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={piece.title}
                  onChange={(e) => updatePiece(pieceIndex, "title", e.target.value)}
                  className="bg-background border-b border-neutral/50 p-1.5 w-full text-base focus:outline-none focus:ring-2 focus:ring-primary touch-action-manipulation"
                />
                <input
                  type="text"
                  placeholder="Composer"
                  value={piece.composer}
                  onChange={(e) => updatePiece(pieceIndex, "composer", e.target.value)}
                  className="bg-background border-b border-neutral/50 p-1.5 w-full text-base focus:outline-none focus:ring-2 focus:ring-primary touch-action-manipulation"
                />
                <div className="mt-2">
                  <h4 className="text-xs sm:text-sm font-semibold font-sans mb-1">Movements</h4>
                  {piece.movements.map((movement, movementIndex) => (
                    <div
                      key={movementIndex}
                      className="flex flex-col sm:flex-row gap-2 mb-2 bg-neutral/20 p-2 rounded"
                    >
                      <input
                        type="text"
                        placeholder="Movement Number (e.g., I, 1)"
                        value={movement.number}
                        onChange={(e) =>
                          updateMovement(pieceIndex, movementIndex, "number", e.target.value)
                        }
                        className="bg-background border-b border-neutral/50 p-1.5 w-full sm:w-1/4 text-base focus:outline-none focus:ring-2 focus:ring-primary touch-action-manipulation"
                      />
                      <input
                        type="text"
                        placeholder="Movement Title (e.g., Allegro)"
                        value={movement.title}
                        onChange={(e) =>
                          updateMovement(pieceIndex, movementIndex, "title", e.target.value)
                        }
                        className="bg-background border-b border-neutral/50 p-1.5 w-full sm:flex-1 text-base focus:outline-none focus:ring-2 focus:ring-primary touch-action-manipulation"
                      />
                      <button
                        type="button"
                        onClick={() => removeMovement(pieceIndex, movementIndex)}
                        className="bg-danger text-white px-2 py-1 text-xs sm:text-sm hover:bg-red-500 transition cursor-pointer active:scale-95"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addMovement(pieceIndex)}
                    className="bg-primary text-white hover:text-background px-2 py-1 text-xs sm:text-sm rounded hover:bg-neutral-mid transition cursor-pointer active:scale-95"
                  >
                    + Add Movement
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removePiece(pieceIndex)}
                  className="bg-danger text-white px-2 py-1 text-xs sm:text-sm hover:bg-red-500 transition cursor-pointer active:scale-95 mt-2"
                >
                  Remove Piece
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addPiece}
            className="bg-primary text-white px-2 py-1.5 rounded text-xs sm:text-base hover:bg-neutral-mid transition cursor-pointer active:scale-95"
          >
            + Add Piece
          </button>
        </div>
      )}
    </div>
  );
}