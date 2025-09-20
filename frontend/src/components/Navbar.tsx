import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="p-4 flex items-center">
      <div className="w-1/3 text-2xl text-special-dark"><Link href="/" className="hover:text-primary">Orpheus Collections</Link></div>
      <div className="w-1/3 flex gap-4 items-center">
        <Link href="/watches" className="transition hover:scale-105 hover:text-primary active:scale-95">Watches</Link>
        <Link href="/music" className="transition hover:scale-105 hover:text-primary active:scale-95">Music</Link>
        <Link href="/films" className="transition hover:scale-105 hover:text-primary active:scale-95">Films</Link>
        <Link href="/books" className="transition hover:scale-105 hover:text-primary active:scale-95">Books</Link>
        <Link href="/wardrobe" className="transition hover:scale-105 hover:text-primary active:scale-95">Wardrobe</Link>
        <Link href="/games" className="transition hover:scale-105 hover:text-primary active:scale-95">Games</Link>
        <Link href="/art" className="transition hover:scale-105 hover:text-primary active:scale-95">Art</Link>
        <Link href="/instruments" className="transition hover:scale-105 hover:text-primary active:scale-95">Instruments</Link>
        <Link href="/extra" className="transition hover:scale-105 hover:text-primary active:scale-95">Extras</Link>
        <ThemeToggle />
      </div>
      <div className="w-1/3">
        
      </div>
    </nav>
  );
}