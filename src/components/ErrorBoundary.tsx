'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Игнорировать ошибки MetaMask и других расширений браузера
    if (
      error.message.includes('MetaMask') ||
      error.message.includes('chrome-extension') ||
      error.message.includes('Failed to connect to MetaMask')
    ) {
      return { hasError: false };
    }
    
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Логируем только реальные ошибки приложения
    if (
      !error.message.includes('MetaMask') &&
      !error.message.includes('chrome-extension') &&
      !error.message.includes('Failed to connect to MetaMask')
    ) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Что-то пошло не так
              </h2>
              <p className="text-gray-600 mb-6">
                Произошла ошибка в приложении. Попробуйте обновить страницу.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Обновить страницу
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
} 