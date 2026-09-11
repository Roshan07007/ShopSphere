import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
  LogOut,
  Sparkles,
  Command,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import SpotlightSearchModal from './SpotlightSearchModal.jsx';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, setIsDrawerOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();

  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const userMenuRef = useRef(null);

  // Keyboard shortcut (Cmd+K or Ctrl+K) to trigger Spotlight Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      {/* Floating Dynamic Island Container */}
      <div className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
        <header
          className={`pointer-events-auto transition-all duration-300 dynamic-island rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 max-w-5xl w-full bg-white dark:bg-slate-900/95 backdrop-blur-2xl border border-[#E2E8F0] dark:border-slate-800 ${
            isScrolled ? 'shadow-[0_8px_30px_rgba(15,23,42,0.1)] scale-[0.98]' : 'shadow-[0_4px_20px_rgba(15,23,42,0.06)]'
          }`}
        >
          {/* Brand Sphere Hologram */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-primary-600 via-accent-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-primary-500/30 group-hover:rotate-12 group-hover:scale-105 transition-all duration-300">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black tracking-tight text-[#1E293B] dark:text-white leading-none">
                Shop<span className="text-gradient">Sphere</span>
              </span>
              <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ₹ INR
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F8FAFC] dark:bg-slate-800/80 px-2 py-1 rounded-full border border-[#E2E8F0] dark:border-slate-700/80">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-xs transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 font-extrabold border border-primary-200/80 dark:border-primary-500/30 shadow-[0_2px_8px_rgba(99,102,241,0.12)]'
                    : 'text-[#1E293B] dark:text-slate-300 hover:text-primary-600 dark:hover:text-white font-bold hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`
              }
            >
              Home
            </NavLink>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 font-extrabold border border-primary-200/80 dark:border-primary-500/30 shadow-[0_2px_8px_rgba(99,102,241,0.12)]'
                      : 'text-[#1E293B] dark:text-slate-300 hover:text-primary-600 dark:hover:text-white font-bold hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Spotlight Command Search Trigger */}
          <button
            onClick={() => setIsSpotlightOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F8FAFC] dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-[#E2E8F0] dark:border-slate-700 text-xs font-bold text-[#1E293B] dark:text-slate-300 transition group flex-1 max-w-[210px] shadow-sm"
            title="Search Products (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 transition" />
            <span className="truncate text-slate-600 dark:text-slate-300">Search catalog...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 border border-[#E2E8F0] dark:border-slate-700 ml-auto shadow-sm">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* Action Cluster (Search on mobile, Theme, Wishlist, Cart Orb, User Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSpotlightOpen(true)}
              className="sm:hidden p-2 rounded-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#1E293B] dark:text-slate-200 hover:bg-slate-100 shadow-sm"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark/Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#1E293B] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-sm"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Wishlist Pill */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#1E293B] hover:text-rose-600 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-700 transition shadow-sm"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Animated Cart Orb */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 sm:px-3 sm:py-1.5 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-primary-500/30 transition active:scale-95 group border border-primary-500/60"
              title="Shopping Cart"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline font-black">Bag</span>
              {itemCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-primary-600 text-[10px] font-black flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Holographic Avatar / Profile Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 p-1 rounded-full border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-sm"
                  aria-label="User profile"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <ChevronDown className="w-3 h-3 text-slate-500 mr-0.5" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-900 backdrop-blur-2xl rounded-3xl shadow-[0_12px_40px_rgba(15,23,42,0.14)] border border-[#E2E8F0] dark:border-slate-800 py-2 z-50 animate-slide-up">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] text-slate-500">Welcome,</p>
                      <p className="text-sm font-black text-[#1E293B] dark:text-white truncate">
                        {user.name}
                      </p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {user.role === 'admin' ? 'Administrator' : 'Verified Shopper 🇮🇳'}
                      </span>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Mission Control</span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#1E293B] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Addresses & Profile</span>
                      </Link>
                      <Link
                        to="/my-orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#1E293B] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <Package className="w-4 h-4 text-slate-500" />
                        <span>My Orders & Tracking</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1E293B] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-sm transition"
                >
                  Join
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#1E293B] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Cyber Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-4 top-16 sm:top-18 z-40 md:hidden bg-white dark:bg-slate-900 backdrop-blur-2xl rounded-3xl shadow-[0_15px_50px_rgba(15,23,42,0.15)] border border-[#E2E8F0] dark:border-slate-800 p-5 space-y-3 animate-slide-up">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSpotlightOpen(true);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold shadow-sm"
          >
            <Search className="w-4 h-4 text-primary-600" />
            <span>Search Indian catalog...</span>
          </button>

          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/80 dark:border-primary-800 shadow-sm'
                    : 'text-[#1E293B] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              Home
            </NavLink>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/80 dark:border-primary-800 shadow-sm'
                      : 'text-[#1E293B] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800"
              >
                Admin Dashboard
              </NavLink>
            )}
          </nav>
        </div>
      )}

      {/* Spotlight Command Search Modal */}
      <SpotlightSearchModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />

      {/* Spacer so page content begins beneath the floating island */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default Navbar;
