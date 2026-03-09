"use client";

import { useState, useEffect, useRef } from "react";
import { Instagram, Facebook, Youtube, Linkedin, User, LogOut, LayoutDashboard } from "lucide-react";
import { usePathname } from "@/lib/hooks";

const menuData = [
  { id: 1, title: "Le Groupe", path: "/legroupe" },
  { id: 2, title: "Musique", path: "/musique" },
  { id: 3, title: "Concerts", path: "/concerts" },
  { id: 4, title: "Photos", path: "/photos" },
  { id: 5, title: "Contact", path: "/contact" },
];


type UserMenuDropdownProps = {
  isAdmin: boolean;
  userMenuOpen: boolean;
  setUserMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
};

function UserMenuDropdown({ isAdmin, userMenuOpen, setUserMenuOpen, handleLogout }: UserMenuDropdownProps) {
  return (
    <div data-user-menu className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
        aria-label="Menu utilisateur"
        aria-expanded={userMenuOpen}
        className="flex items-center justify-center p-1 text-white/60 hover:text-primary transition-colors"
      >
        <User className="h-5 w-5" />
      </button>
      {userMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-red-500/20 bg-[#0d0d0d]/95 backdrop-blur-md shadow-xl py-1 z-[9999]">
          {isAdmin ? (
            <>
              <a
                href="/admin"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-primary hover:bg-red-950/30 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Tableau de bord
              </a>
              <div className="border-t border-red-500/20 my-1" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-red-400 hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </>
          ) : (
            <a
              href="/admin/login"
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-primary hover:bg-red-950/30 transition-colors"
            >
              <User className="h-4 w-4" />
              Se connecter
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const currentPath = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("admin_access") === "true");

    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        const { authenticated } = data as { authenticated: boolean };
        setIsAdmin(authenticated);
        if (authenticated) {
          localStorage.setItem("admin_access", "true");
        } else {
          localStorage.removeItem("admin_access");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleStickyNavbar = () => {
      setSticky(window.scrollY >= 80);
    };
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavbarOpen(false);
      }
    };
    document.addEventListener("click", handleClickAway);
    return () => document.removeEventListener("click", handleClickAway);
  }, []);

  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-user-menu]")) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickAway);
    return () => document.removeEventListener("click", handleClickAway);
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("admin_access");
      setIsAdmin(false);
      setUserMenuOpen(false);
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <header
      className={`left-0 top-0 z-40 flex w-full items-center transition-all duration-300 ${
        sticky
          ? "fixed z-[9999] bg-[#0d0d0d]/95 shadow-lg shadow-primary/5 backdrop-blur-md"
          : "absolute bg-transparent"
      }`}
    >
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="max-w-full px-4 xl:mr-6">
            <a
              href="/"
              className={`flex items-center gap-3 ${sticky ? "py-2 lg:py-1" : "py-3"}`}
            >
              <span className="font-chiller text-xl font-bold tracking-wide whitespace-nowrap">
                <span className="text-primary">TriBa</span> <span className="text-white">MonDo</span>
              </span>
            </a>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div className="w-full">
              <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-1 lg:hidden pr-2">
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white/70 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                ) : (
                  <a
                    href="/admin/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white/70 hover:text-primary transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Connexion
                  </a>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNavbarOpen(!navbarOpen);
                  }}
                  aria-label="Menu mobile"
                  className="block rounded-full p-2 ring-primary focus:ring-2"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[25px] bg-white transition-all duration-300 ${
                      navbarOpen ? "top-[7px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[25px] bg-white transition-all duration-300 ${
                      navbarOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[25px] bg-white transition-all duration-300 ${
                      navbarOpen ? "top-[-8px] -rotate-45" : ""
                    }`}
                  />
                </button>
              </div>
              <nav
                ref={navRef}
                className={`absolute left-0 right-0 z-30 w-full border-t border-red-500/20 bg-[#0d0d0d]/95 px-6 py-4 backdrop-blur-md duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                  navbarOpen
                    ? "visible top-full opacity-100"
                    : "invisible top-[120%] opacity-0"
                }`}
              >
                <ul className="block lg:flex lg:w-full lg:items-center lg:space-x-8">
                  {menuData.map((menuItem) => (
                    <li key={menuItem.id} className="group relative">
                      <a
                        href={menuItem.path}
                        onClick={() => setNavbarOpen(false)}
                        className={`flex py-2 text-base font-medium transition-colors duration-200 lg:mr-0 lg:inline-flex lg:px-0 lg:py-4 ${
                          currentPath === menuItem.path
                            ? "text-primary"
                            : "text-white/80 hover:text-primary"
                        }`}
                      >
                        {menuItem.title}
                      </a>
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                          currentPath === menuItem.path
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }`}
                      />
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="hidden lg:flex items-center gap-4 ml-8">
              <a
                href="https://www.instagram.com/triba_mondo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/60 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61575204444067"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/60 hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@TriBaMonDo/shorts"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/60 hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/triba-mondo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white/60 hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <div className="ml-2">
                <UserMenuDropdown
                  isAdmin={isAdmin}
                  userMenuOpen={userMenuOpen}
                  setUserMenuOpen={setUserMenuOpen}
                  handleLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}