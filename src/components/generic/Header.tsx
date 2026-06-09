"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, LogOut, MessageCircle, X } from "lucide-react";
import { NotificationPopover } from "@/components/notifications/NotificationPopover";
import { SEARCHABLE_PAGES } from "@/data/constant-navbar-search";

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState(SEARCHABLE_PAGES);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredResults([]);
      setIsSearchOpen(false);
    } else {
      const filtered = SEARCHABLE_PAGES.filter(
        (page) =>
          page.name.toLowerCase().includes(query.toLowerCase()) ||
          page.path.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredResults(filtered);
      setIsSearchOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    clearSearch();
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-[#0096FF] md:hidden mr-3 flex-shrink-0"
            aria-label="Open sidebar"
          >
            <Menu size={26} />
          </button>
          <div className="hidden md:block truncate max-w-[240px] lg:max-w-xs">
            <h1 className="text-base font-semibold text-gray-800 truncate">
              Welcome back, {session?.user?.name?.split(" ")[0] || "Admin"}!
            </h1>
          </div>
        </div>
        <div className="flex-[2] flex justify-center px-2 md:px-4">
          <div
            className="hidden md:flex items-center relative w-full max-w-lg"
            ref={searchRef}
          >
            <Search className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search resource, pages, or features (e.g., trips)..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim() !== "" && setIsSearchOpen(true)}
              className="pl-10 pr-10 py-1.5 w-full text-sm bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0096FF] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
              >
                <X size={14} />
              </button>
            )}
            {isSearchOpen && (
              <div className="absolute top-full mt-1.5 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                {renderSearchResults(filteredResults, handleNavigation)}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
          <button className="relative p-2 text-gray-600 hover:text-[#0096FF] hover:bg-gray-100 rounded-full transition-colors">
            <MessageCircle size={22} />
          </button>
          <NotificationPopover />

          <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            aria-label="Logout"
          >
            <LogOut size={20} />
            <span className="hidden lg:block font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const renderSearchResults = (
  results: typeof SEARCHABLE_PAGES,
  onSelect: (href: string) => void,
) => {
  if (results.length === 0) {
    return (
      <div className="px-4 py-6 text-sm text-gray-500 text-center">
        No pages found matching that query.
      </div>
    );
  }

  return (
    <div className="py-2 max-h-80 overflow-y-auto">
      <div className="px-3.5 py-1 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
        Platform Navigation
      </div>
      <ul className="mt-1">
        {results.map((page) => {
          const IconComponent = page.icon;
          return (
            <li key={page.href}>
              <button
                onClick={() => onSelect(page.href)}
                className="w-full text-left flex items-center px-4 py-2.5 hover:bg-gray-50 group transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-[#0096FF]/10 group-hover:text-[#0096FF] transition-colors mr-3 flex-shrink-0">
                  <IconComponent size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-[#0096FF] transition-colors truncate">
                    {page.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5 font-mono">
                    {page.path}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Header;
