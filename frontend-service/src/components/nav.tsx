 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = ["", "find-players", "games", "grounds", "tournaments", "billing", "shop", "profile", "admin"];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav">
      {links.map((path) => (
        <Link
          key={path || "home"}
          href={`/${path}`}
          className={`nav-link ${pathname === `/${path}` || (path === "" && pathname === "/") ? "active" : ""}`}
        >
          {path ? path.replace("-", " ") : "home"}
        </Link>
      ))}
    </nav>
  );
}
