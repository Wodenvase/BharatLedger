'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Menu, X, LogOut, User } from 'lucide-react';

export default function Navigation() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const isDashboard = pathname?.startsWith('/dashboard');

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BharatLedger</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isDashboard && !isAuthenticated && (
              <>
                <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </Link>
                <Link href="/#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                  How It Works
                </Link>
                <Link href="/#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </Link>
              </>
            )}

            {isDashboard && isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className={`${
                    pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-600'
                  } hover:text-gray-900 transition-colors`}
                >
                  Overview
                </Link>
                <Link
                  href="/dashboard/transactions"
                  className={`${
                    pathname === '/dashboard/transactions' ? 'text-blue-600' : 'text-gray-600'
                  } hover:text-gray-900 transition-colors`}
                >
                  Transactions
                </Link>
                <Link
                  href="/dashboard/health"
                  className={`${
                    pathname === '/dashboard/health' ? 'text-blue-600' : 'text-gray-600'
                  } hover:text-gray-900 transition-colors`}
                >
                  Health
                </Link>
                <Link
                  href="/dashboard/reports"
                  className={`${
                    pathname === '/dashboard/reports' ? 'text-blue-600' : 'text-gray-600'
                  } hover:text-gray-900 transition-colors`}
                >
                  Reports
                </Link>
              </>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="text-sm">{session?.user?.name || session?.user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!isDashboard && !isAuthenticated && (
              <>
                <Link
                  href="/#features"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/#how-it-works"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="/#about"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </>
            )}

            {isDashboard && isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Overview
                </Link>
                <Link
                  href="/dashboard/transactions"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Transactions
                </Link>
                <Link
                  href="/dashboard/health"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Health
                </Link>
                <Link
                  href="/dashboard/reports"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reports
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="px-3 py-2 space-y-2">
                <div className="text-sm text-gray-700">
                  {session?.user?.name || session?.user?.email}
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Link
                  href="/login"
                  className="block w-full text-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
