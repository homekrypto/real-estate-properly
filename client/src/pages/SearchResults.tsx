import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useRoute } from 'wouter';
import { Search, Filter, Grid, List, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

interface Property {
  id: number;
  title: string;
  price: string;
  currency: string;
  country: string;
  region: string;
  city: string;
  propertyType: string;
  listingType: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  images: string[];
  views: number;
}

export default function SearchResults() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    country: '',
    region: '',
    city: '',
    propertyType: '',
    listingType: 'sale',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });

  // Parse URL parameters and route params
  const [match, params] = useRoute('/:country/:region?/:listingType?/:propertyType?');
  const urlParams = new URLSearchParams(location.split('?')[1] || '');

  useEffect(() => {
    // Update filters based on URL
    if (params?.country) {
      setFilters(prev => ({ ...prev, country: params.country || '' }));
    }
    if (params?.region) {
      setFilters(prev => ({ ...prev, region: params.region || '' }));
    }
    if (params?.listingType) {
      setFilters(prev => ({ ...prev, listingType: params.listingType || 'sale' }));
    }
    if (params?.propertyType) {
      setFilters(prev => ({ ...prev, propertyType: params.propertyType || '' }));
    }

    // Parse URL search params
    urlParams.forEach((value, key) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    });

    // Set listing type based on route
    if (location.includes('/rent')) {
      setFilters(prev => ({ ...prev, listingType: 'rent' }));
    } else if (location.includes('/buy')) {
      setFilters(prev => ({ ...prev, listingType: 'sale' }));
    }
  }, [location, params]);

  // Fetch properties based on filters
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['/api/properties', filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) searchParams.set(key, value);
      });
      
      const response = await fetch(`/api/properties?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
  });

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

  const updateFilters = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getPageTitle = () => {
    if (params?.country && params?.region) {
      return `${t('search.propertiesIn')} ${params.region}, ${params.country}`;
    }
    if (params?.country) {
      return `${t('search.propertiesIn')} ${params.country}`;
    }
    return `${filters.listingType === 'rent' ? t('nav.rent') : t('nav.buy')} ${t('search.properties')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {properties.length} {t('search.propertiesFound')}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Filter className="h-5 w-5 text-forest-600 dark:text-forest-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('search.filters')}</h2>
                </div>

                <div className="space-y-6">
                  {/* Listing Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('search.listingType')}
                    </label>
                    <Select value={filters.listingType} onValueChange={(value) => updateFilters('listingType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">{t('listingTypes.sale')}</SelectItem>
                        <SelectItem value="rent">{t('listingTypes.rent')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('search.propertyType')}
                    </label>
                    <Select value={filters.propertyType} onValueChange={(value) => updateFilters('propertyType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('search.allTypes')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('search.allTypes')}</SelectItem>
                        <SelectItem value="villa">{t('propertyTypes.villa')}</SelectItem>
                        <SelectItem value="apartment">{t('propertyTypes.apartment')}</SelectItem>
                        <SelectItem value="penthouse">{t('propertyTypes.penthouse')}</SelectItem>
                        <SelectItem value="farmhouse">{t('propertyTypes.farmhouse')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('search.location')}
                    </label>
                    <div className="space-y-3">
                      <Input
                        placeholder={t('search.country')}
                        value={filters.country}
                        onChange={(e) => updateFilters('country', e.target.value)}
                      />
                      <Input
                        placeholder={t('search.region')}
                        value={filters.region}
                        onChange={(e) => updateFilters('region', e.target.value)}
                      />
                      <Input
                        placeholder={t('search.city')}
                        value={filters.city}
                        onChange={(e) => updateFilters('city', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('search.priceRange')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder={t('search.minPrice')}
                        value={filters.minPrice}
                        onChange={(e) => updateFilters('minPrice', e.target.value)}
                      />
                      <Input
                        placeholder={t('search.maxPrice')}
                        value={filters.maxPrice}
                        onChange={(e) => updateFilters('maxPrice', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('search.bedrooms')}
                    </label>
                    <Select value={filters.bedrooms} onValueChange={(value) => updateFilters('bedrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('search.anyBedrooms')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('search.anyBedrooms')}</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('search.bathrooms')}
                    </label>
                    <Select value={filters.bathrooms} onValueChange={(value) => updateFilters('bathrooms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('search.anyBathrooms')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('search.anyBathrooms')}</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Select defaultValue="newest">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('search.sortNewest')}</SelectItem>
                  <SelectItem value="price-low">{t('search.sortPriceLow')}</SelectItem>
                  <SelectItem value="price-high">{t('search.sortPriceHigh')}</SelectItem>
                  <SelectItem value="popular">{t('search.sortPopular')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(filters).map(([key, value]) => {
                if (value && key !== 'listingType') {
                  return (
                    <Badge key={key} variant="secondary" className="px-3 py-1">
                      {key}: {value}
                      <button
                        onClick={() => updateFilters(key, '')}
                        className="ml-2 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  );
                }
                return null;
              })}
            </div>

            {/* Properties Grid/List */}
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="floating-card">
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
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
            ) : properties.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('search.noResults')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('search.noResultsDescription')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {properties.map((property: Property) => (
                  <Card key={property.id} className="floating-card group">
                    <Link href={`/property/${property.id}`}>
                      <div className={`${viewMode === 'list' ? 'md:flex' : ''}`}>
                        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'md:w-1/3' : ''}`}>
                          <img
                            src={property.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"}
                            alt={property.title}
                            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                              viewMode === 'list' ? 'w-full h-48 md:h-full' : 'w-full h-64'
                            }`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                          >
                            <Heart className="h-4 w-4 text-gray-600" />
                          </Button>
                          <div className="absolute bottom-4 left-4">
                            <Badge className="bg-forest-600 text-white">
                              {t(`propertyTypes.${property.propertyType}`)}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className={`p-6 ${viewMode === 'list' ? 'md:w-2/3' : ''}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                                {property.title}
                              </h3>
                              <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">
                                {formatPrice(property.price, property.currency)}
                              </div>
                              <div className="text-gray-600 dark:text-gray-400">
                                {property.city}, {property.region}, {property.country}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <span>{property.bedrooms} {t('property.beds')}</span>
                            <span>{property.bathrooms} {t('property.baths')}</span>
                            <span>{property.area} m²</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">AG</span>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{t('property.agent')}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              <Eye className="h-3 w-3" />
                              <span>{property.views}</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {properties.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" disabled>
                    {t('pagination.previous')}
                  </Button>
                  <Button variant="default" className="bg-forest-600 hover:bg-forest-700">
                    1
                  </Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">
                    {t('pagination.next')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
