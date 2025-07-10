export const translations = {
  en: {
    // Header
    "nav.buy": "Buy",
    "nav.rent": "Rent",
    "nav.agents": "Agents",
    "nav.pricing": "Pricing",
    "nav.insights": "Insights",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    
    // Hero
    "hero.title": "Find Your",
    "hero.title.highlight": "Dream Home",
    "hero.subtitle": "Discover luxury properties worldwide with our premium platform. Connect with elite agents across 35+ countries.",
    "hero.search.placeholder": "Search by location...",
    "hero.search.button": "Search Luxury Properties",
    
    // Properties
    "property.bedrooms": "Beds",
    "property.bathrooms": "Baths",
    "property.save": "Save",
    "property.contact": "Contact Agent",
    "property.view.all": "View All Properties",
    
    // Footer
    "footer.description": "The world's leading luxury real estate platform, connecting discerning buyers with premium properties across 35+ countries.",
    "footer.links.quick": "Quick Links",
    "footer.links.professional": "For Professionals",
    "footer.copyright": "© 2025 Properly. All rights reserved.",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.try.again": "Try again",
  },
  es: {
    // Header
    "nav.buy": "Comprar",
    "nav.rent": "Alquilar",
    "nav.agents": "Agentes",
    "nav.pricing": "Precios",
    "nav.insights": "Tendencias",
    "nav.login": "Iniciar Sesión",
    "nav.signup": "Registrarse",
    
    // Hero
    "hero.title": "Encuentra Tu",
    "hero.title.highlight": "Casa de Ensueño",
    "hero.subtitle": "Descubre propiedades de lujo en todo el mundo con nuestra plataforma premium. Conéctate con agentes de élite en más de 35 países.",
    "hero.search.placeholder": "Buscar por ubicación...",
    "hero.search.button": "Buscar Propiedades de Lujo",
    
    // Properties
    "property.bedrooms": "Dorm.",
    "property.bathrooms": "Baños",
    "property.save": "Guardar",
    "property.contact": "Contactar Agente",
    "property.view.all": "Ver Todas las Propiedades",
    
    // Footer
    "footer.description": "La plataforma inmobiliaria de lujo líder en el mundo, conectando compradores exigentes con propiedades premium en más de 35 países.",
    "footer.links.quick": "Enlaces Rápidos",
    "footer.links.professional": "Para Profesionales",
    "footer.copyright": "© 2025 Properly. Todos los derechos reservados.",
    
    // Common
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
    "common.try.again": "Intentar de nuevo",
  },
  pl: {
    // Header
    "nav.buy": "Kupno",
    "nav.rent": "Wynajem",
    "nav.agents": "Agenci",
    "nav.pricing": "Cennik",
    "nav.insights": "Analizy",
    "nav.login": "Zaloguj",
    "nav.signup": "Zarejestruj się",
    
    // Hero
    "hero.title": "Znajdź Swój",
    "hero.title.highlight": "Wymarzony Dom",
    "hero.subtitle": "Odkryj luksusowe nieruchomości na całym świecie dzięki naszej premium platformie. Połącz się z elitarnymi agentami w ponad 35 krajach.",
    "hero.search.placeholder": "Szukaj według lokalizacji...",
    "hero.search.button": "Szukaj Luksusowych Nieruchomości",
    
    // Properties
    "property.bedrooms": "Sypialnie",
    "property.bathrooms": "Łazienki",
    "property.save": "Zapisz",
    "property.contact": "Kontakt z Agentem",
    "property.view.all": "Zobacz Wszystkie Nieruchomości",
    
    // Footer
    "footer.description": "Wiodąca światowa platforma luksusowych nieruchomości, łącząca wymagających nabywców z premium nieruchomościami w ponad 35 krajach.",
    "footer.links.quick": "Szybkie Linki",
    "footer.links.professional": "Dla Profesjonalistów",
    "footer.copyright": "© 2025 Properly. Wszelkie prawa zastrzeżone.",
    
    // Common
    "common.loading": "Ładowanie...",
    "common.error": "Wystąpił błąd",
    "common.try.again": "Spróbuj ponownie",
  },
  de: {
    // Header
    "nav.buy": "Kaufen",
    "nav.rent": "Mieten",
    "nav.agents": "Makler",
    "nav.pricing": "Preise",
    "nav.insights": "Einblicke",
    "nav.login": "Anmelden",
    "nav.signup": "Registrieren",
    
    // Hero
    "hero.title": "Finden Sie Ihr",
    "hero.title.highlight": "Traumhaus",
    "hero.subtitle": "Entdecken Sie Luxusimmobilien weltweit mit unserer Premium-Plattform. Verbinden Sie sich mit Elite-Maklern in über 35 Ländern.",
    "hero.search.placeholder": "Nach Standort suchen...",
    "hero.search.button": "Luxusimmobilien Suchen",
    
    // Properties
    "property.bedrooms": "Schlafz.",
    "property.bathrooms": "Bäder",
    "property.save": "Speichern",
    "property.contact": "Makler Kontaktieren",
    "property.view.all": "Alle Immobilien Anzeigen",
    
    // Footer
    "footer.description": "Die weltweit führende Luxusimmobilien-Plattform, die anspruchsvolle Käufer mit Premium-Immobilien in über 35 Ländern verbindet.",
    "footer.links.quick": "Schnellzugriff",
    "footer.links.professional": "Für Profis",
    "footer.copyright": "© 2025 Properly. Alle Rechte vorbehalten.",
    
    // Common
    "common.loading": "Laden...",
    "common.error": "Ein Fehler ist aufgetreten",
    "common.try.again": "Erneut versuchen",
  },
};

export function getTranslation(language: string, key: string): string {
  const lang = language as keyof typeof translations;
  return translations[lang]?.[key as keyof typeof translations[typeof lang]] || key;
}
