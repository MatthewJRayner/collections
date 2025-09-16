"use client";

import React, { useState } from "react";

type Award = {
    award: string;
    won: boolean;
    category: string;
};

type Props = {
    awards: Award[];
    setAwards: (a: Award[]) => void;
};

export default function AwardsEditor({ awards, setAwards }: Props) {
    const [awardsView, setAwardsView] = useState(false);

    const addAward = () =>
        setAwards([...awards, { award: "", won: false, category: "" }]);

    const updateAward = (
        index: number,
        field: keyof Award,
        value: string | boolean
    ) => {
        const updated = [...awards];
        updated[index][field] = value as never;
        setAwards(updated);
    };

    const removeAward = (index: number) => {
        setAwards(awards.filter((_, i) => i !== index));
    };

    return (
        <div className="p-3 rounded bg-neutral shadow w-full">
            <button
                type="button" 
                className="mb-2 text-neutral-mid w-full text-left cursor-pointer"
                onClick={() => setAwardsView(!awardsView)}
            >
                <span className={`mr-1 transition ${awardsView ? "text-primary" : ""}`}>Awards</span>
                <span className={`transition duration-400 ${awardsView ? "text-primary" : ""}`}>▼</span>
            </button>
            {awardsView && (
                <>
                    {awards.map((award, index) => (
                        <div key={index} className="mb-3 bg-background shadow p-2 rounded">
                            <input
                            type="text"
                            placeholder="Award Name"
                            value={award.award}
                            onChange={(e) => updateAward(index, "award", e.target.value)}
                            className="bg-background shadow p-1 w-full rounded mb-2"
                            />
                            <input
                            type="text"
                            placeholder="Category"
                            value={award.category}
                            onChange={(e) => updateAward(index, "category", e.target.value)}
                            className="bg-background shadow p-1 w-full rounded mb-2"
                            />
                            <label className="flex items-center space-x-2">
                                <input
                                type="checkbox"
                                checked={award.won}
                                onChange={(e) => updateAward(index, "won", e.target.checked)}
                                />
                                <span>Won?</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => removeAward(index)}
                                className="bg-red-500 text-white text-sm px-2 py-1 rounded mt-2"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addAward}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                        + Add Award
                    </button>
                </>
            )}
        </div>
    );
}
