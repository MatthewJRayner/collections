"use client";

import React, { useState } from "react";

type Crew = {
    name: string;
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
                className="mb-2 text-neutral-mid w-full text-left cursor-pointer"
                onClick={() => setCrewView(!crewView)}
            >
                <span className={`mr-1 transition ${crewView ? "text-primary" : ""}`}>Crew</span>
                <span className={`transition duration-400 ${crewView ? "text-primary" : ""}`}>▼</span>
            </button>
            {crewView && (
                <>
                    {crewlist.map((member, index) => (
                        <div key={index} className="mb-3 bg-background shadow p-2 rounded">
                        <input
                            type="text"
                            placeholder="Actor Name"
                            value={member.name}
                            onChange={(e) => updateMember(index, "name", e.target.value)}
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