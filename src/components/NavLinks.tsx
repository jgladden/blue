"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Patient Dashboard" },
  { href: "/insights", label: "Insights" },
  { href: "/criteria", label: "Risk Criteria" },
  { href: "/brief", label: "Product Brief" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-6 text-sm">
      {links.map(({ href, label }) => {
        const isActive =
          href === "/"
            ? pathname === "/" || pathname.startsWith("/patient")
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`transition-colors ${
              isActive
                ? "text-foreground font-medium"
                : "text-muted hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
