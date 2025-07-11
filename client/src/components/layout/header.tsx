import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Crown, Globe, Sun, Moon, Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Header() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "pl", name: "Polski", flag: "🇵🇱" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇵🇹" }
  ];

  const navigation = [
    { name: t('nav.buy') || t('navigation.buy') || 'Buy', href: "/search?type=sale" },
    { name: t('nav.rent') || t('navigation.rent') || 'Rent', href: "/search?type=rent" },
    { name: t('nav.agents') || t('navigation.agents') || 'Agents', href: "/agents" },
    { name: t('nav.pricing') || t('navigation.pricing') || 'Pricing', href: "/pricing" },
    { name: t('nav.insights') || t('navigation.blog') || 'Insights', href: "/blog" },
    { name: t('nav.developers') || t('navigation.developers') || 'Developers', href: "/developer" }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    setIsLanguageOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-forest-600 to-forest-800 rounded-lg flex items-center justify-center">
              <Crown className="text-gold-400 h-6 w-6" />
            </div>
            <span className="font-luxury text-2xl font-bold text-forest-800 dark:text-forest-300">
              Properly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`text-gray-700 dark:text-gray-300 hover:text-forest-600 dark:hover:text-forest-400 transition-colors font-medium ${
                  location === item.href ? 'text-forest-600 dark:text-forest-400' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Globe className="text-forest-600 dark:text-forest-400 h-4 w-4" />
                <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
                <svg 
                  className={`w-3 h-3 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
              
              {/* Language Dropdown */}
              {isLanguageOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="text-gold-500 h-5 w-5" />
              ) : (
                <Moon className="text-blue-600 h-5 w-5" />
              )}
            </Button>

            {/* Auth Section */}
            {!isLoading && (
              <div className="hidden lg:flex items-center space-x-3">
                {isAuthenticated && user ? (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 px-3 py-2"
                    >
                      {user.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center">
                          <User className="text-white h-4 w-4" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user.firstName || user.email}
                      </span>
                    </Button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                        <Link 
                          href="/dashboard"
                          className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span className="text-sm">Dashboard</span>
                        </Link>
                        <a 
                          href="/api/logout"
                          className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm">Logout</span>
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => window.location.href = '/login'}
                      className="px-4 py-2 text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 font-medium transition-colors bg-transparent border-none"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/signup'}
                      className="px-6 py-2 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Register
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-gray-700 dark:text-gray-300 hover:text-forest-600 dark:hover:text-forest-400 transition-colors font-medium px-2 py-1 ${
                    location === item.href ? 'text-forest-600 dark:text-forest-400' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {!isLoading && !isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => window.location.href = '/login'}
                    className="px-4 py-2 text-center text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 font-medium transition-colors bg-transparent border-none"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/signup'}
                    className="px-4 py-2 text-center bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
