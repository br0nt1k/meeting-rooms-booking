"use client";

import Link from "next/link";
import { useUserStore } from "@/lib/store";
import { authService } from "@/lib/services/authService";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { user, isLoading } = useUserStore();

  const handleLogout = async () => {
    await authService.logout();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-sm transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl font-bold text-black tracking-tight hover:opacity-80 transition-opacity"
        >
          Booking App
        </Link>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-24 h-9 bg-black/5 animate-pulse rounded-lg"></div>
          ) : user ? (
            <>
              <span className="text-sm text-gray-600 hidden md:block">
                Привіт, <b className="text-black">{user.displayName || user.email}</b>
              </span>
              
              <Link 
                href="/my-bookings" 
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                {user.role === 'admin' ? "Всі бронювання" : "Мої бронювання"}
              </Link>
              
              <Button variant="secondary" onClick={handleLogout} className="text-sm h-9">
                Вийти
              </Button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Увійти
              </Link>
              
              <Link href="/register">
                <Button className="text-sm h-9 shadow-lg shadow-blue-500/10">
                  Реєстрація
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}