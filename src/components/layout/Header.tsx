import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X, Clock, Trash2 } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSearchHistoryStore } from '@/store/searchHistoryStore';
import { ROUTES, BRAND } from '@/constants';
import { categories } from '@/constants/categories';
import { classNames } from '@/utils/format';

const NAV_LINKS = categories.slice(0, 8).map((c) => ({ label: c.name, slug: c.slug }));

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.count());
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistoryStore();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openSearch = () => {
    setSearchOpen(true);
    // Foco automático com pequeno delay para aguardar a animação de abertura
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchValue('');   // ← Bug 5 corrigido: limpar ao fechar
    setShowHistory(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchValue.trim();
    if (!term) return;
    addSearch(term);
    navigate(`${ROUTES.catalog}?busca=${encodeURIComponent(term)}`);
    closeSearch();
  };

  const handleHistoryClick = (term: string) => {
    addSearch(term);
    navigate(`${ROUTES.catalog}?busca=${encodeURIComponent(term)}`);
    closeSearch();
  };

  const filteredHistory = searchValue.trim()
    ? history.filter((h) => h.toLowerCase().includes(searchValue.toLowerCase()))
    : history;

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
              onClick={openSearch}
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
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 top-[116px] z-40 bg-ink-950/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSearch}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-0 top-full z-50 border-b border-ink-200 bg-cream-50 shadow-elevated"
              role="search"
            >
              <form onSubmit={handleSearchSubmit} className="container-app flex items-center gap-4 py-5">
                <Search className="h-5 w-5 flex-shrink-0 text-ink-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setShowHistory(true)}
                  placeholder="Buscar por vestidos, blazers, marcas..."
                  className="flex-1 bg-transparent font-display text-lg text-ink-900 placeholder:text-ink-300 focus:outline-none"
                  aria-label="Campo de busca"
                  autoComplete="off"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => setSearchValue('')}
                    aria-label="Limpar busca"
                    className="text-ink-400 hover:text-ink-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Fechar busca"
                  className="text-ink-500 hover:text-ink-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>

              {/* Histórico de pesquisa */}
              <AnimatePresence>
                {showHistory && filteredHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="container-app overflow-hidden pb-5"
                  >
                    <div className="flex items-center justify-between py-2">
                      <span className="text-2xs font-semibold uppercase tracking-wider text-ink-400">
                        {searchValue.trim() ? 'Sugestões' : 'Pesquisas recentes'}
                      </span>
                      {!searchValue.trim() && history.length > 0 && (
                        <button
                          type="button"
                          onClick={clearHistory}
                          className="text-2xs font-semibold text-ink-400 hover:text-danger"
                        >
                          Limpar histórico
                        </button>
                      )}
                    </div>
                    <ul className="flex flex-col">
                      {filteredHistory.map((term) => (
                        <li key={term} className="flex items-center gap-3 py-1.5">
                          <Clock className="h-3.5 w-3.5 flex-shrink-0 text-ink-300" aria-hidden="true" />
                          <button
                            type="button"
                            onClick={() => handleHistoryClick(term)}
                            className="flex-1 text-left text-sm text-ink-700 hover:text-gold-700"
                          >
                            {term}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSearch(term)}
                            aria-label={`Remover "${term}" do histórico`}
                            className="text-ink-300 hover:text-ink-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
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
