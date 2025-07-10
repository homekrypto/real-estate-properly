import { useTranslation } from 'react-i18next';

// Currency mapping for different regions
const CURRENCY_MAP: Record<string, string> = {
  en: 'USD',
  es: 'EUR',
  de: 'EUR',
  fr: 'EUR',
  it: 'EUR',
  pt: 'EUR',
  pl: 'PLN',
};

// Locale mapping for Intl formatting
const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
  fr: 'fr-FR',
  it: 'it-IT',
  pt: 'pt-PT',
  pl: 'pl-PL',
};

export function useLocalization() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  const locale = LOCALE_MAP[currentLanguage] || 'en-US';
  const currency = CURRENCY_MAP[currentLanguage] || 'USD';

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat(locale).format(number);
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateObj);
  };

  const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  const formatRelativeTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-minutes, 'minute');
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-hours, 'hour');
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-days, 'day');
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-months, 'month');
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-years, 'year');
    }
  };

  const formatArea = (squareMeters: number): string => {
    if (currentLanguage === 'en') {
      // Convert to square feet for US/UK
      const squareFeet = Math.round(squareMeters * 10.764);
      return `${formatNumber(squareFeet)} sq ft`;
    }
    return `${formatNumber(squareMeters)} m²`;
  };

  return {
    formatCurrency,
    formatNumber,
    formatDate,
    formatDateTime,
    formatRelativeTime,
    formatArea,
    locale,
    currency,
    currentLanguage,
  };
}

// Utility function for standalone use without hooks
export function formatCurrencyStandalone(amount: number, language: string = 'en'): string {
  const locale = LOCALE_MAP[language] || 'en-US';
  const currency = CURRENCY_MAP[language] || 'USD';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateStandalone(date: Date | string, language: string = 'en'): string {
  const locale = LOCALE_MAP[language] || 'en-US';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}