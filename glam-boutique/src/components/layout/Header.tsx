import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ROUTES, BRAND } from '@/constants';
import { categories } from '@/constants/categories';
import { classNames } from '@/utils/format';

const NAV_LINKS = categories.slice(0, 8).map((c) => ({ label: c.name, slug: c.slug }));

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.count());

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`${ROUTES.catalog}?busca=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />
      <div
        className={classNames(
          'border-b bg-cream-50/95 backdrop-blur transition-shadow duration-300',
          isScrolled ? 'border-ink-200 shadow-soft' : 'border-transparent'
        )}
      >
        <div className="container-app flex h-20 items-center justify-between gap-4">
          {/* Mobile menu trigger */}
          <button
            className="p-2 text-ink-700 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link to={ROUTES.home} className="flex flex-shrink-0 flex-col items-center">
            <span className="font-display text-2xl tracking-wide text-ink-900 sm:text-3xl">
              {BRAND.name}
            </span>
            <span className="hidden text-2xs uppercase tracking-widest2 text-gold-600 sm:block">
              {BRAND.tagline}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex" aria-label="Categorias principais">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.slug}
                to={ROUTES.catalogByCategory(link.slug)}
                className={({ isActive }) =>
                  classNames(
                    'link-underline text-sm font-medium uppercase tracking-wide text-ink-700 transition-colors hover:text-gold-700',
                    isActive && 'text-gold-700'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar produtos"
              className="p-2 text-ink-700 hover:text-gold-700"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link to={ROUTES.account} aria-label="Minha conta" className="hidden p-2 text-ink-700 hover:text-gold-700 sm:block">
              <User className="h-5 w-5" />
            </Link>
            <Link
              to={ROUTES.accountWishlist}
              aria-label={`Lista de desejos, ${wishlistCount} itens`}
              className="relative hidden p-2 text-ink-700 hover:text-gold-700 sm:block"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-ink-950">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={openCart} aria-label={`Carrinho, ${totalItems} itens`} className="relative p-2 text-ink-700 hover:text-gold-700">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink-900 text-[10px] font-bold text-cream-50">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-0 top-full border-b border-ink-200 bg-cream-50 shadow-elevated"
            role="search"
          >
            <form onSubmit={handleSearchSubmit} className="container-app flex items-center gap-4 py-5">
              <Search className="h-5 w-5 text-ink-400" />
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar por vestidos, blazers, marcas..."
                className="flex-1 bg-transparent font-display text-lg text-ink-900 placeholder:text-ink-300 focus:outline-none"
              />
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Fechar busca" className="text-ink-500 hover:text-ink-900">
                <X className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-ink-950/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 z-[85] h-full w-80 bg-cream-50 p-6 shadow-elevated"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl text-ink-900">{BRAND.name}</span>
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to={ROUTES.catalogByCategory(c.slug)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="border-b border-ink-100 py-3 text-sm font-medium uppercase tracking-wide text-ink-700 hover:text-gold-700"
                  >
                    {c.name}
                  </Link>
                ))}
                <Link
                  to={ROUTES.account}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 py-3 text-sm font-medium uppercase tracking-wide text-ink-700"
                >
                  Minha conta
                </Link>
                <Link
                  to={ROUTES.accountWishlist}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-sm font-medium uppercase tracking-wide text-ink-700"
                >
                  Lista de desejos
                </Link>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
