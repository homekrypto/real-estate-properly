import { Crown, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-forest-600 to-forest-800 rounded-lg flex items-center justify-center">
                <Crown className="text-gold-400 h-7 w-7" />
              </div>
              <span className="font-luxury text-3xl font-bold text-white">Properly</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-lg">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-forest-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-forest-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-forest-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-forest-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/search?type=sale" 
                  className="text-gray-400 hover:text-forest-400 transition-colors"
                >
                  {t('footer.propertiesForSale')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/search?type=rent" 
                  className="text-gray-400 hover:text-forest-400 transition-colors"
                >
                  {t('footer.propertiesForRent')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/agents" 
                  className="text-gray-400 hover:text-forest-400 transition-colors"
                >
                  {t('footer.findAgent')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-400 hover:text-forest-400 transition-colors"
                >
                  {t('footer.marketInsights')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/developer" 
                  className="text-gray-400 hover:text-forest-400 transition-colors"
                >
                  {t('footer.developerSolutions')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Professional Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">{t('footer.forProfessionals')}</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/pricing" 
                  className="text-gray-400 hover:text-forest-400 transition-colors"
                >
                  {t('footer.agentPlans')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/developer" 
                  className="text-gray-400 hover:text-forest-400 transition-colors"
                >
                  {t('footer.developerSolutions')}
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-forest-400 transition-colors"
                >
                  {t('footer.apiDocs')}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-forest-400 transition-colors"
                >
                  {t('footer.marketingTools')}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-forest-400 transition-colors"
                >
                  {t('footer.supportCenter')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-forest-400" />
              <div>
                <div className="text-sm text-gray-400">{t('footer.email')}</div>
                <div className="text-white">contact@properly.com</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-forest-400" />
              <div>
                <div className="text-sm text-gray-400">{t('footer.phone')}</div>
                <div className="text-white">+1 (555) 123-4567</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-forest-400" />
              <div>
                <div className="text-sm text-gray-400">{t('footer.headquarters')}</div>
                <div className="text-white">New York, NY</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Presence */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">{t('footer.globalPresence')}</h3>
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
            <div className="text-gray-400 text-sm">
              © {currentYear} Properly. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a 
                href="#" 
                className="text-gray-400 hover:text-forest-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-forest-400 transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-forest-400 transition-colors"
              >
                Cookie Policy
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-forest-400 transition-colors"
              >
                Legal
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
