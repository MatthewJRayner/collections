"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="p-4 flex items-center justify-between w-full">
      <div className="text-2xl text-special-dark font-logos">
        <Link href="/" className="hover:text-primary">Orpheus Archives</Link>
      </div>
      <div className="hidden md:flex gap-4 items-center">
        <Link href="/watches" className="transition hover:scale-105 hover:text-primary active:scale-95">Watches</Link>
        <Link href="/music" className="transition hover:scale-105 hover:text-primary active:scale-95">Music</Link>
        <Link href="/films" className="transition hover:scale-105 hover:text-primary active:scale-95">Films</Link>
        <Link href="/books" className="transition hover:scale-105 hover:text-primary active:scale-95">Books</Link>
        <Link href="/performances" className="transition hover:scale-105 hover:text-primary active:scale-95">Performances</Link>
        <Link href="/wardrobe" className="transition hover:scale-105 hover:text-primary active:scale-95">Wardrobe</Link>
        <Link href="/games" className="transition hover:scale-105 hover:text-primary active:scale-95">Games</Link>
        <Link href="/art" className="transition hover:scale-105 hover:text-primary active:scale-95">Art</Link>
        <Link href="/instruments" className="transition hover:scale-105 hover:text-primary active:scale-95">Instruments</Link>
        <Link href="/extra" className="transition hover:scale-105 hover:text-primary active:scale-95">Extras</Link>
        <ThemeToggle />
      </div>
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        {isMenuOpen ? "✕" : "☰"}
      </button>
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-background/20 backdrop-blur-2xl shadow-lg md:hidden flex flex-col items-center gap-4 py-4 z-50">
          <Link
            href="/watches"
            className="transition hover:scale-105 hover:text-primary active:scale-95"
            onClick={toggleMenu}
          >
            Watches
          </Link>
          <Link
            href="/music"
            className="transition hover:scale-105 hover:text-primary active:scale-95"
            onClick={toggleMenu}
          >
            Music
          </Link>
          <Link
            href="/films"
            className="transition hover:scale-105 hover:text-primary active:scale-95"
            onClick={toggleMenu}
          >
            Films
          </Link>
          <Link
            href="/books"
            className="transition hover:scale-105 hover:text-primary active:scale-95"
            onClick={toggleMenu}
          >
            Books
          </Link>
          <Link
            href="/wardrobe"
            className="transition hover:scale-105 hover:text-primary active:scale-95"
            onClick={toggleMenu}
          >
            Wardrobe
          </Link>
          <Link
            href="/games"
            className="transition hover:scale-105 hover:text-primary active:scale-95"
            onClick={toggleMenu}
          >
            Games
          </Link>
          <Link
            href="/art"
            className="transition hover:scale-105 hover:text-primary active:scale-95"
            onClick={toggleMenu}
          >
            Art
          </Link>
          <Link
            href="/instruments"
            className="transition hover:scale-105 hover:text-primary active:scale-95"
            onClick={toggleMenu}
          >
            Instruments
          </Link>
          <Link
            href="/extra"
            className="transition hover:scale-105 hover:text-primary active:scale-95"
            onClick={toggleMenu}
          >
            Extras
          </Link>
          <ThemeToggle />
        </div>
      )}
    </nav>
  );
}