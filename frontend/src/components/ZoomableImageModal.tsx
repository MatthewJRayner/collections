"use client";
import { useState } from "react";

type ZoomableImageModalProps = {
  src: string;
  alt?: string;
  onClose: () => void;
};

export default function ZoomableImageModal({ src, alt, onClose }: ZoomableImageModalProps) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState(1);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(5, prev + 0.2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      setInitialPinchDistance(distance);
      setInitialScale(scale);
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      e.preventDefault();
      setIsDragging(true);
      setStartPos({ x: e.touches[0].clientX - translate.x, y: e.touches[0].clientY - translate.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance !== null) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const newScale = initialScale * (currentDistance / initialPinchDistance);
      setScale(Math.min(Math.max(0.5, newScale), 5));
    } else if (isDragging && e.touches.length === 1) {
      setTranslate({ x: e.touches[0].clientX - startPos.x, y: e.touches[0].clientY - startPos.y });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialPinchDistance(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPos({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTranslate({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDoubleClick = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded shadow-lg max-h-[90vh] max-w-[90vw] overflow-hidden cursor-grab active:cursor-grabbing relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            className="bg-neutral-mid text-background shadow p-2 rounded hover:bg-neutral hover:text-foreground transition cursor-pointer z-10"
            onClick={handleZoomIn}
          >
            +
          </button>
          <button
            className="bg-neutral-mid text-background shadow p-2 rounded hover:bg-neutral hover:text-foreground transition cursor-pointer z-10"
            onClick={handleZoomOut}
          >
            -
          </button>
        </div>
        <img
          src={src}
          alt={alt || "Image preview"}
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.2s ease",
          }}
          className="select-none pointer-events-none max-h-[80vh] max-w-[90vw]"
        />
      </div>
    </div>
  );
}