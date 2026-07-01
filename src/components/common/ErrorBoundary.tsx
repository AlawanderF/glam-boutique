import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Em produção: enviar para serviço de monitoramento (Sentry, Datadog etc.)
    console.error('Erro capturado pelo ErrorBoundary:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-50 px-6 text-center">
          <AlertTriangle className="h-10 w-10 text-gold-600" />
          <h1 className="font-display text-2xl text-ink-900">Algo não saiu como esperado</h1>
          <p className="max-w-sm text-sm text-ink-500">
            Encontramos um problema inesperado. Por favor, recarregue a página ou volte para a loja.
          </p>
          <button onClick={this.handleReload} className="btn-primary">
            Voltar para a home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
