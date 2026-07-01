import { useToastStore } from '@/store/toastStore';

export function SocialLoginButtons() {
  const showToast = useToastStore((s) => s.show);

  const handleSocialLogin = (provider: string) => {
    // Em produção: redirecionar para fluxo OAuth real (services/authService.ts)
    showToast({ type: 'info', message: `Conectando com ${provider}...` });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => handleSocialLogin('Google')}
        className="flex items-center justify-center gap-2 border border-ink-300 px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.56 1 10.22 1 12s.43 3.44 1.18 4.94l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        Google
      </button>
      <button
        type="button"
        onClick={() => handleSocialLogin('Facebook')}
        className="flex items-center justify-center gap-2 border border-ink-300 px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900"
      >
        <svg className="h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
        </svg>
        Facebook
      </button>
    </div>
  );
}
