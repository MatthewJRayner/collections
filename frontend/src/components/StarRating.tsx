"use client";

import { useState } from "react";

type StarRatingProps = {
  value: number; // rating from 1–10
  onChange: (value: number) => void;
};

export default function StarRating({ value, onChange }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const currentValue = hoverValue ?? value;
  const isHovering = hoverValue !== null;

  // Colors
  const baseColor = "#9CA3AF"; // GRAY-400
  const savedColor = "#ffbc2f"; // WARNING
  const hoverColor = "#307cf6"; // PRIMARY

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const leftValue = starIndex * 2 - 1; // odd (half)
        const rightValue = starIndex * 2; // even (full)

        let fill: string = baseColor; // default: grey

        if (currentValue >= rightValue) {
          fill = isHovering ? hoverColor : savedColor; // full
        } else if (currentValue === leftValue) {
          // half star with gradient
          fill = `url(#half-fill-${starIndex})`;
        }

        return (
          <div key={starIndex} className="relative w-8 h-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-8 h-8"
            >
              <defs>
                <linearGradient
                  id={`half-fill-${starIndex}`}
                  x1="0"
                  x2="100%"
                  y1="0"
                  y2="0"
                >
                  <stop
                    offset="50%"
                    stopColor={isHovering ? hoverColor : savedColor}
                  />
                  <stop offset="50%" stopColor={baseColor} />
                </linearGradient>
              </defs>

              <path
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.497.04.698.663.321.988l-4.204 3.6a.563.563 0 00-.182.557l1.285 5.385c.112.469-.388.84-.791.593l-4.727-2.885a.563.563 0 00-.586 0l-4.727 2.885c-.403.247-.903-.124-.791-.593l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.6c-.377-.325-.176-.948.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                fill={fill}
              />
            </svg>

            {/* Left half hit area */}
            <button
              type="button"
              onMouseEnter={() => setHoverValue(leftValue)}
              onMouseLeave={() => setHoverValue(null)}
              onClick={() => onChange(leftValue)}
              className="absolute top-0 left-0 w-1/2 h-full cursor-pointer"
            />

            {/* Right half hit area */}
            <button
              type="button"
              onMouseEnter={() => setHoverValue(rightValue)}
              onMouseLeave={() => setHoverValue(null)}
              onClick={() => onChange(rightValue)}
              className="absolute top-0 right-0 w-1/2 h-full cursor-pointer"
            />
          </div>
        );
      })}
    </div>
  );
}