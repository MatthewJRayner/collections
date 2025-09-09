import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex gap-6">
      <Link href="/">Home</Link>
      <Link href="/watches">Watches</Link>
      <Link href="/music">Music</Link>
      <Link href="/films">Films</Link>
      <Link href="/books">Books</Link>
      <Link href="/wardrobe">Wardrobe</Link>
      <Link href="/games">Games</Link>
      <Link href="/art">Art</Link>
      <Link href="/extras">Extras</Link>
    </nav>
  );
}