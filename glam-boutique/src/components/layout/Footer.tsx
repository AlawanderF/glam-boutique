import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { BRAND, CONTACT, ROUTES, SOCIAL_LINKS, STORE_ADDRESS } from '@/constants';
import { categories } from '@/constants/categories';
import { NewsletterForm } from '@/components/home/NewsletterForm';

function InstagramIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-ink-950 text-ink-200">
      <div className="container-app py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <span className="font-display text-2xl text-cream-50">{BRAND.name}</span>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-400">{BRAND.slogan}.</p>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                Ganhe 10% OFF na primeira compra
              </p>
              <p className="mt-1 text-xs text-ink-400">Cadastre-se e receba novidades em primeira mão.</p>
              <NewsletterForm variant="dark" />
            </div>

            <div className="mt-7 flex gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Glam Boutique"
                className="rounded-full border border-ink-700 p-2.5 text-ink-300 transition-colors hover:border-gold-400 hover:text-gold-400"
              >
                <InstagramIcon />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Glam Boutique"
                className="rounded-full border border-ink-700 p-2.5 text-ink-300 transition-colors hover:border-gold-400 hover:text-gold-400"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest2 text-cream-50">Categorias</h3>
            <ul className="mt-4 space-y-2.5">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link to={ROUTES.catalogByCategory(c.slug)} className="text-sm text-ink-400 hover:text-gold-400">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest2 text-cream-50">Institucional</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link to={ROUTES.accountOrders} className="text-sm text-ink-400 hover:text-gold-400">Meus pedidos</Link></li>
              <li><Link to={ROUTES.exchangePolicy} className="text-sm text-ink-400 hover:text-gold-400">Política de troca</Link></li>
              <li><Link to={ROUTES.privacyPolicy} className="text-sm text-ink-400 hover:text-gold-400">Política de privacidade</Link></li>
              <li><Link to={ROUTES.termsOfUse} className="text-sm text-ink-400 hover:text-gold-400">Termos de uso</Link></li>
              <li><a href={`mailto:${CONTACT.email}`} className="text-sm text-ink-400 hover:text-gold-400">Trabalhe conosco</a></li>
            </ul>
          </div>

          {/* Contato / Loja física */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest2 text-cream-50">Nossa loja</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-400">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" />
                <span>
                  {STORE_ADDRESS.street}, {STORE_ADDRESS.number} - {STORE_ADDRESS.complement}
                  <br />
                  {STORE_ADDRESS.neighborhood}, {STORE_ADDRESS.city} - {STORE_ADDRESS.state}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <a href={`tel:${CONTACT.whatsapp}`} className="hover:text-gold-400">{CONTACT.whatsapp}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-gold-400">{CONTACT.email}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <span>{CONTACT.hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-5 text-2xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <p>CNPJ {BRAND.cnpjPlaceholder} · {STORE_ADDRESS.city} - {STORE_ADDRESS.state}</p>
            <Link to="/admin" className="text-ink-600 hover:text-gold-400">
              Painel administrativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
