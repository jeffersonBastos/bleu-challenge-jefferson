import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function NavLink({ href, children, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-content-foreground hover:text-primary/80",
        isActive && "text-primary"
      )}
    >
      {children}
    </Link>
  );
}
