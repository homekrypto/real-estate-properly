import { Link, useLocation } from 'wouter';
import { Crown, Menu, X } from 'lucide-react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ...existing code...
  // Removed any navigation items for 'Checkout Global subscription', 'Activate with Facebook', 'Activate with Google', 'Activate with LinkedIn' (none present)
  const navigation = [
    { name: t('nav.buy'), href: '/buy' },
    { name: t('nav.rent'), href: '/rent' },
    { name: t('nav.agents'), href: '/agents' },
    { name: t('nav.pricing'), href: '/pricing' },
    { name: t('nav.insights'), href: '/blog' },
    { name: t('nav.developers', 'Developers'), href: '/developer' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full glass-effect z-50 border-b border-border/50">
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 luxury-gradient rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-gold-400" />
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
                  className={`text-sm font-medium transition-colors hover:text-forest-600 dark:hover:text-forest-400 ${
                    location === item.href
                      ? 'text-forest-600 dark:text-forest-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />

              {/* Auth Buttons - Desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-forest-600 dark:text-forest-400">
                    {t('auth.login')}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="luxury-button">
                    {t('auth.signUp')}
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border/50">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location === item.href
                        ? 'text-forest-600 dark:text-forest-400 bg-forest-50 dark:bg-forest-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="pt-4 space-y-2">
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      {t('auth.login')}
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button className="w-full luxury-button" onClick={() => setMobileMenuOpen(false)}>
                      {t('auth.signUp')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer - Unified with homepage */}
      <footer className="bg-white dark:bg-black text-gray-900 dark:text-white py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center">
                  <Crown className="h-6 w-6 text-gold-400" />
                </div>
                <span className="font-luxury text-3xl font-bold text-white">Properly</span>
              </div>
              <p className="text-black dark:text-gray-400 leading-relaxed max-w-lg">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-gray-800 hover:bg-forest-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t('footer.quickLinks')}</h3>
              <ul className="space-y-3">
                {[
                  { name: t('footer.propertiesForSale'), href: '/buy' },
                  { name: t('footer.propertiesForRent'), href: '/rent' },
                  { name: t('footer.findAgent'), href: '/agents' },
                  { name: t('footer.marketInsights'), href: '/blog' },
                  { name: t('footer.developerSolutions'), href: '/developer' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-black hover:text-forest-600 dark:text-gray-400 dark:hover:text-forest-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Professionals */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t('footer.forProfessionals')}</h3>
              <ul className="space-y-3">
                {[
                  { name: t('footer.agentPlans'), href: '/pricing' },
                  { name: t('footer.apiDocs'), href: '/api-docs' },
                  { name: t('footer.marketingTools'), href: '/tools' },
                  { name: t('footer.supportCenter'), href: '/support' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-black hover:text-forest-600 dark:text-gray-400 dark:hover:text-forest-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-forest-400" />
              <div>
                <div className="text-sm text-black dark:text-gray-400">Email</div>
                <div className="text-black dark:text-white">contact@properly.com</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-forest-400" />
              <div>
                <div className="text-sm text-black dark:text-gray-400">Phone</div>
                <div className="text-black dark:text-white">+1 (555) 123-4567</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-forest-400" />
              <div>
                <div className="text-sm text-black dark:text-gray-400">Headquarters</div>
                <div className="text-black dark:text-white">New York, NY</div>
              </div>
            </div>
          </div>

          {/* Global Presence */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-white">Global Presence</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm text-gray-400">
              <div>🇺🇸 United States</div>
              <div>🇬🇧 United Kingdom</div>
              <div>🇪🇸 Spain</div>
              <div>🇮🇹 Italy</div>
              <div>🇫🇷 France</div>
              <div>🇩🇪 Germany</div>
              <div>🇵🇹 Portugal</div>
              <div>🇬🇷 Greece</div>
              <div>🇩🇴 Dominican Republic</div>
              <div>🇨🇳 China</div>
              <div>🇦🇪 UAE</div>
              <div>🇨🇭 Switzerland</div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="text-black dark:text-gray-400 text-sm">
                © 2025 Properly. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
               <Link href="/privacy" className="text-black hover:text-forest-600 dark:text-gray-400 dark:hover:text-forest-400 transition-colors">
                  Privacy Policy
                </Link>
               <Link href="/terms" className="text-black hover:text-forest-600 dark:text-gray-400 dark:hover:text-forest-400 transition-colors">
                  Terms of Service
                </Link>
               <Link href="/cookies" className="text-black hover:text-forest-600 dark:text-gray-400 dark:hover:text-forest-400 transition-colors">
                  Cookie Policy
                </Link>
               <Link href="/legal" className="text-black hover:text-forest-600 dark:text-gray-400 dark:hover:text-forest-400 transition-colors">
                  Legal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
