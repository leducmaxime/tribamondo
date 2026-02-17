"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { Instagram, Facebook, Youtube, User } from "lucide-react";

const menuData = [
  { id: 1, title: "Le Groupe", path: "/legroupe" },
  { id: 2, title: "Musique", path: "/musique" },
  { id: 3, title: "Concerts", path: "/concerts" },
  { id: 4, title: "Contact", path: "/contact" },
];

function usePathname() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("popstate", callback);

      const originalPushState = history.pushState.bind(history);
      const originalReplaceState = history.replaceState.bind(history);

      history.pushState = (...args) => {
        originalPushState(...args);
        callback();
      };
      history.replaceState = (...args) => {
        originalReplaceState(...args);
        callback();
      };

      return () => {
        window.removeEventListener("popstate", callback);
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
      };
    },
    () => window.location.pathname,
    () => "/",
  );
}

export function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const currentPath = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("admin_access") === "true");
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
              <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-3 lg:hidden">
                <button
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
                <a
                  href="/admin"
                  aria-label="Administration"
                  className="flex items-center justify-center p-2 text-white/60 hover:text-primary transition-colors"
                >
                  <User className="h-6 w-6" />
                </a>
              </div>
              <nav
                ref={navRef}
                className={`absolute right-0 z-30 w-[250px] rounded-lg border border-red-500/20 bg-[#0d0d0d]/95 px-6 py-4 backdrop-blur-md duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
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
                href="https://soundcloud.com/tribamondo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SoundCloud"
                className="text-white/60 hover:text-primary transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.56 8.87V17h8.76c1.85-.13 2.68-1.27 2.68-2.5 0-1.65-1.34-3-3-3-.23 0-.45.03-.66.08C18.94 8.83 16.65 7 14 7c-.89 0-1.72.24-2.44.67v1.2zM7 17h1V8.5H7V17zm-2 0h1V9.5H5V17zm-2 0h1v-4H3v4zm-2 0h1v-2H1v2z" />
                </svg>
              </a>
              <a
                href="/admin"
                aria-label="Administration"
                className="text-white/60 hover:text-primary transition-colors ml-2"
              >
                <User className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
