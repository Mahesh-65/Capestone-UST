import Link from "next/link";

const links = ["", "find-players", "games", "grounds", "tournaments", "billing", "shop", "profile", "admin"];

export function Nav() {
  return (
    <nav className="flex flex-wrap gap-3 py-4">
      {links.map((path) => (
        <Link key={path || "home"} href={`/${path}`} className="rounded-md border border-zinc-700 px-3 py-1 text-sm">
          {path ? path.replace("-", " ") : "home"}
        </Link>
      ))}
    </nav>
  );
}
