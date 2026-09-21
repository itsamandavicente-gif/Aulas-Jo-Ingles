"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NavLinks({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const links = [
    { href: "/", label: "Painel" },
    { href: "/vocabulario", label: "Vocabulário" },
    { href: "/vocabulario/nova", label: "Nova palavra" },
    { href: "/aulas", label: "Aulas" },
  ];

  return (
    <nav className="topnav">
      <div className="links">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={"navlink" + (pathname === l.href ? " active" : "")}>
            {l.label}
          </Link>
        ))}
      </div>
      <form action={sair}>
        <button type="submit">Sair ({email})</button>
      </form>
    </nav>
  );
}
