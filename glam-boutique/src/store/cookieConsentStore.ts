import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CookieConsent = 'accepted' | 'essential-only' | null;

interface CookieConsentState {
  consent: CookieConsent;
  setConsent: (consent: CookieConsent) => void;
}

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set) => ({
      consent: null,
      setConsent: (consent) => set({ consent }),
    }),
    { name: 'glam-boutique-cookie-consent' }
  )
);
