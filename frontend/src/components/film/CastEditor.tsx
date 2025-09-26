"use client";

import React, { useState } from "react";

type Cast = {
  actor: string;
  role: string;
};

type Props = {
  castlist: Cast[];
  setCastlist: (c: Cast[]) => void;
};

export default function CastEditor({ castlist, setCastlist }: Props) {
  const [castView, setCastView] = useState(false);

  const addMember = () => setCastlist([...castlist, { actor: "", role: "" }]);

  const updateMember = (index: number, field: keyof Cast, value: string) => {
    const updated = [...castlist];
    updated[index][field] = value;
    setCastlist(updated);
  };

  const removeMember = (index: number) => {
    setCastlist(castlist.filter((_, i) => i !== index));
  };

  return (
    <div className="p-2 rounded bg-neutral shadow w-full">
      <button
        type="button"
        className="mb-2 w-full text-left text-xs sm:text-sm cursor-pointer"
        onClick={() => setCastView(!castView)}
      >
        <span className={`mr-1 transition ${castView ? "text-primary" : ""}`}>
          Cast
        </span>
        <span
          className={`transition duration-400 ${
            castView ? "text-primary" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {castView && (
        <>
          {castlist.map((member, index) => (
            <div key={index} className="mb-3 bg-background shadow p-2 rounded">
              <input
                type="text"
                placeholder="Actor Name"
                value={member.actor}
                onChange={(e) => updateMember(index, "actor", e.target.value)}
                className="bg-background border-foreground border-b-1 p-1 w-full text-sm sm:text-base mb-2"
              />
              <input
                type="text"
                placeholder="Role"
                value={member.role}
                onChange={(e) => updateMember(index, "role", e.target.value)}
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
            + Add Cast Member
          </button>
        </>
      )}
    </div>
  );
}
