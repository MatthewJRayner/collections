import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 flex items-center">
      <div className="w-1/3 text-3xl text-special-dark"><Link href="/">Orpheus Collections</Link></div>
      <div className="w-2/3 flex gap-4">
        <Link href="/watches">Watches</Link>
        <Link href="/music">Music</Link>
        <Link href="/films">Films</Link>
        <Link href="/books">Books</Link>
        <Link href="/wardrobe">Wardrobe</Link>
        <Link href="/games">Games</Link>
        <Link href="/art">Art</Link>
        <Link href="/extras">Extras</Link>
      </div>
    </nav>
  );
}