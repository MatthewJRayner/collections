"use client";

import React, { useState } from "react";

type Crew = {
    name: string[];
    role: string;
}

type Props = {
    crewlist: Crew[];
    setCrewlist: (c: Crew[]) => void;
}

export default function CastEditor({ crewlist, setCrewlist }: Props) {
    const [crewView, setCrewView] = useState(false);

    const addMember = () => setCrewlist([...crewlist, { name: "", role: "" }]);

    const updateMember = (index: number, field: keyof Crew, value: string) => {
        const updated = [...crewlist];
        updated[index][field] = value;
        setCrewlist(updated);
    };

    const removeMember = (index: number) => {
        setCrewlist(crewlist.filter((_, i) => i !== index));
    };

    return (
        <div className="p-2 rounded bg-neutral shadow w-full">
            <button
                type="button" 
                className="mb-2 w-full text-left cursor-pointer"
                onClick={() => setCrewView(!crewView)}
            >
                <span className={`mr-1 transition ${crewView ? "text-primary" : ""}`}>Crew</span>
                <span className={`transition-all duration-400 ${crewView ? "text-primary transform rotate-90" : ""}`}>▼</span>
            </button>
            {crewView && (
                <>
                    {crewlist.map((member, index) => (
                        <div key={index} className="mb-3 bg-background shadow p-2 rounded">
                        <input
                            type="text"
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) => updateMember(index, "name", e.target.value)}
                            className="bg-background border-foreground border-b-1 p-1 w-full rounded mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Role"
                            value={member.role}
                            onChange={(e) => updateMember(index, "role", e.target.value)}
                            className="bg-background border-foreground border-b-1 p-1 w-full rounded"
                        />
                        <button
                            type="button"
                            onClick={() => removeMember(index)}
                            className="bg-danger text-white px-2 py-1 mt-2 rounded hover:bg-red-500 transition cursor-pointer active:scale-95"
                        >
                            Remove
                        </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMember}
                        className="bg-primary text-white px-2 py-2 rounded hover:text-background hover:bg-neutral-mid transition cursor-pointer active:scale-95"
                    >
                        + Add Crew Member
                    </button>
                </>
            )}
        </div>
    );
}