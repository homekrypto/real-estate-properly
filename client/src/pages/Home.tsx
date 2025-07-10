import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Search, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useLocation } from 'wouter';

interface Property {
  id: number;
  title: string;
  price: string;
  currency: string;
  country: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  images: string[];
  agentId: number;
}

export default function Home() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [searchForm, setSearchForm] = useState({
    country: '',
    propertyType: '',
    priceRange: '',
  });

  // Fetch featured properties
  const { data: featuredProperties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties/featured'],
  });

  // Fetch available countries
  const { data: countries = [] } = useQuery({
    queryKey: ['/api/locations/countries'],
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchForm.country) params.set('country', searchForm.country);
    if (searchForm.propertyType) params.set('propertyType', searchForm.propertyType);
    if (searchForm.priceRange) params.set('priceRange', searchForm.priceRange);
    
    setLocation(`/search?${params.toString()}`);
  };

  const formatPrice = (price: string, currency: string) => {
    const num = parseFloat(price);
    if (num >= 1000000) {
      return `${currency}${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${currency}${(num / 1000).toFixed(0)}K`;
    }
    return `${currency}${num.toLocaleString()}`;
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-forest-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="font-luxury text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  {t('hero.findYour')}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-gold-500">
                    {t('hero.dreamHome')}
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                  {t('hero.description')}
                </p>
              </div>

              {/* Search Form */}
              <Card className="luxury-shadow border-border/50">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('search.country')}
                      </label>
                      <Select value={searchForm.country} onValueChange={(value) => setSearchForm(prev => ({ ...prev, country: value }))}>
                        <SelectTrigger className="luxury-input">
                          <SelectValue placeholder={t('search.selectCountry')} />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country: string) => (
                            <SelectItem key={country} value={country.toLowerCase()}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('search.propertyType')}
                      </label>
                      <Select value={searchForm.propertyType} onValueChange={(value) => setSearchForm(prev => ({ ...prev, propertyType: value }))}>
                        <SelectTrigger className="luxury-input">
                          <SelectValue placeholder={t('search.allTypes')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="villa">{t('propertyTypes.villa')}</SelectItem>
                          <SelectItem value="apartment">{t('propertyTypes.apartment')}</SelectItem>
                          <SelectItem value="penthouse">{t('propertyTypes.penthouse')}</SelectItem>
                          <SelectItem value="farmhouse">{t('propertyTypes.farmhouse')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('search.budget')}
                      </label>
                      <Select value={searchForm.priceRange} onValueChange={(value) => setSearchForm(prev => ({ ...prev, priceRange: value }))}>
                        <SelectTrigger className="luxury-input">
                          <SelectValue placeholder={t('search.anyPrice')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500000-1000000">€500K - €1M</SelectItem>
                          <SelectItem value="1000000-2000000">€1M - €2M</SelectItem>
                          <SelectItem value="2000000-5000000">€2M - €5M</SelectItem>
                          <SelectItem value="5000000+">€5M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={handleSearch} className="w-full luxury-button">
                    <Search className="h-5 w-5 mr-2" />
                    {t('search.searchProperties')}
                  </Button>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-forest-600 dark:text-forest-400">35+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.countries')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-forest-600 dark:text-forest-400">10K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.properties')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-forest-600 dark:text-forest-400">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.agents')}</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-slide-up">
              <img
                src="https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Luxury villa with infinity pool"
                className="rounded-2xl luxury-shadow w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl p-4 luxury-shadow border border-border animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 luxury-gradient-gold rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{t('hero.premiumListed')}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('hero.verifiedProperties')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('featured.title')} <span className="text-forest-600 dark:text-forest-400">{t('featured.properties')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('featured.description')}
            </p>
          </div>

          {propertiesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="floating-card">
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property: Property) => (
                <Card key={property.id} className="floating-card group cursor-pointer">
                  <Link href={`/property/${property.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={property.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"}
                        alt={property.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                      >
                        <Heart className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">
                            {formatPrice(property.price, property.currency)}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {property.city}, {property.country}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span>{property.bedrooms} {t('property.beds')}</span>
                        <span>{property.bathrooms} {t('property.baths')}</span>
                        <span>{property.area} m²</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">AG</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('property.agent')}</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/search">
              <Button className="luxury-button">
                {t('featured.viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Agent Platform Preview */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Dashboard Preview */}
            <div className="relative">
              <Card className="luxury-shadow">
                <CardContent className="p-8">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('agent.dashboard')}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{t('agent.managePortfolio')}</p>
                    </div>
                    <div className="w-12 h-12 luxury-gradient rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded"></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">24</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('agent.activeListings')}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">156</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('agent.globalViews')}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">12</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('agent.newLeads')}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">€2.1M</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('agent.totalValue')}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Chart Placeholder */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('agent.performance')}</span>
                        <span className="text-xs text-green-600 dark:text-green-400">+24% {t('agent.thisMonth')}</span>
                      </div>
                      <div className="h-20 bg-gradient-to-r from-forest-100 to-gold-100 dark:from-gray-700 dark:to-gray-600 rounded flex items-end space-x-1 p-2">
                        {[40, 60, 80, 100, 70].map((height, i) => (
                          <div
                            key={i}
                            className="w-4 bg-forest-500 rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('agent.eliteTitle')} <span className="text-forest-600 dark:text-forest-400">{t('agent.platform')}</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('agent.description')}
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: "🌍",
                    title: t('agent.features.globalNetwork.title'),
                    description: t('agent.features.globalNetwork.description'),
                  },
                  {
                    icon: "📊",
                    title: t('agent.features.analytics.title'),
                    description: t('agent.features.analytics.description'),
                  },
                  {
                    icon: "🤖",
                    title: t('agent.features.aiTools.title'),
                    description: t('agent.features.aiTools.description'),
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-forest-100 dark:bg-forest-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{feature.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/pricing">
                <Button className="luxury-button">
                  {t('agent.joinNetwork')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global Network Stats */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gold-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('network.global')} <span className="text-forest-600 dark:text-forest-400">{t('network.network')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('network.description')}
            </p>
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "150M+", label: t('network.stats.buyers') },
              { value: "80+", label: t('network.stats.portals') },
              { value: "35+", label: t('network.stats.countries') },
              { value: "30+", label: t('network.stats.languages') },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
