"use client";

import React, { useState } from "react";

type Cast = {
    actor: string;
    role: string;
}

type Props = {
    castlist: Cast[];
    setCastlist: (c: Cast[]) => void;
}

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
        <div className="p-3 rounded bg-neutral shadow w-full">
            <button
                type="button" 
                className="mb-2 text-neutral-mid w-full text-left cursor-pointer"
                onClick={() => setCastView(!castView)}
            >
                <span className={`mr-1 transition ${castView ? "text-primary" : ""}`}>Cast</span>
                <span className={`transition duration-400 ${castView ? "text-primary" : ""}`}>▼</span>
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
                            className="bg-background shadow p-1 w-full rounded mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Role"
                            value={member.role}
                            onChange={(e) => updateMember(index, "role", e.target.value)}
                            className="bg-background shadow p-1 w-full rounded"
                        />
                        <button
                            type="button"
                            onClick={() => removeMember(index)}
                            className="bg-red-500 text-white text-sm px-2 py-1 rounded mt-2"
                        >
                            Remove
                        </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMember}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                        + Add Cast Member
                    </button>
                </>
            )}
        </div>
    );
}