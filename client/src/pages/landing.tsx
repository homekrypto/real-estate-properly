import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Crown, 
  Search, 
  Heart, 
  Bed, 
  Bath, 
  Square, 
  MapPin,
  Star,
  Globe,
  BarChart3,
  Bot,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  TrendingUp,
  Building
} from "lucide-react";

export default function Landing() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [searchForm, setSearchForm] = useState({
    countryId: "",
    propertyType: "",
    budget: "",
    listingType: "sale"
  });

  const { data: countries = [] } = useQuery({
    queryKey: ["/api/countries"],
  });

  const { data: featuredProperties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/properties/featured"],
  });

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery({
    queryKey: ["/api/blog"],
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value.toString());
    });
    setLocation(`/search-results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-forest-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="font-luxury text-5xl lg:text-7xl font-bold dark:text-white leading-tight text-[#858b95]">
                  {t('hero.findYour')}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-gold-500"> {t('hero.dreamHome')}</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                  {t('hero.description')}
                </p>
              </div>

              {/* Search Form */}
              <Card className="bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('search.country')}</label>
                      <Select value={searchForm.countryId} onValueChange={(value) => setSearchForm(prev => ({ ...prev, countryId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('search.selectCountry')} />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country: any) => (
                            <SelectItem key={country.id} value={country.id.toString()}>
                              {country.flag} {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('search.propertyType')}</label>
                      <Select value={searchForm.propertyType} onValueChange={(value) => setSearchForm(prev => ({ ...prev, propertyType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('search.allTypes')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('search.allTypes')}</SelectItem>
                          <SelectItem value="villa">{t('propertyTypes.villa')}</SelectItem>
                          <SelectItem value="apartment">{t('propertyTypes.apartment')}</SelectItem>
                          <SelectItem value="penthouse">{t('propertyTypes.penthouse')}</SelectItem>
                          <SelectItem value="farmhouse">{t('propertyTypes.farmhouse')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('search.budget')}</label>
                      <Select value={searchForm.budget} onValueChange={(value) => setSearchForm(prev => ({ ...prev, budget: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('search.anyPrice')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('search.anyPrice')}</SelectItem>
                          <SelectItem value="500000-1000000">€500K - €1M</SelectItem>
                          <SelectItem value="1000000-2000000">€1M - €2M</SelectItem>
                          <SelectItem value="2000000-5000000">€2M - €5M</SelectItem>
                          <SelectItem value="5000000-">€5M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="w-full bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    {t('hero.searchButton')}
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
                alt="Luxury villa with infinity pool overlooking Mediterranean coastline" 
                className="rounded-2xl shadow-2xl w-full h-auto" 
              />
              <Card className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 animate-float">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                      <Star className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{t('hero.premiumListed')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('hero.verifiedProperties')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Properties */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('sections.featured')} <span className="text-forest-600 dark:text-forest-400">{t('sections.properties')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('sections.featuredDescription')}
            </p>
          </div>

          {propertiesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-4" />
                    <div className="flex space-x-4 mb-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.slice(0, 6).map((property: any) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group bg-white dark:bg-gray-900">
                  <div className="relative">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute top-4 left-4 bg-forest-600 text-white">
                      {property.listingType === "sale" ? t('listingTypes.sale') : t('listingTypes.rent')}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">
                          €{Number(property.price).toLocaleString()}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {property.city}, {property.region}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span className="flex items-center">
                        <Bed className="mr-1 h-4 w-4" />
                        {property.bedrooms} {t('property.beds')}
                      </span>
                      <span className="flex items-center">
                        <Bath className="mr-1 h-4 w-4" />
                        {property.bathrooms} {t('property.baths')}
                      </span>
                      <span className="flex items-center">
                        <Square className="mr-1 h-4 w-4" />
                        {property.squareMeters} m²
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {property.agentId?.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('agents.eliteAgent')}</span>
                      </div>
                      <Button 
                        onClick={() => setLocation(`/property/${property.id}`)}
                        variant="outline" 
                        size="sm"
                      >
                        {t('common.viewDetails')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              onClick={() => setLocation("/search")}
              className="px-8 py-4 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
{t('common.viewAllProperties')}
            </Button>
          </div>
        </div>
      </section>
      {/* Agent Dashboard Preview */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Dashboard Preview */}
            <div className="relative">
              <Card className="bg-gradient-to-br from-forest-50 to-gold-50 dark:from-gray-800 dark:to-gray-700 shadow-2xl">
                <CardContent className="p-8">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('dashboard.agentDashboard')}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{t('dashboard.managePortfolio')}</p>
                    </div>
                    <div className="w-12 h-12 bg-forest-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="text-white h-6 w-6" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card className="bg-white dark:bg-gray-800">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">24</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.activeListings')}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-gray-800">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">156</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.globalViews')}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-gray-800">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">12</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.newLeads')}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-gray-800">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">€2.1M</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.totalValue')}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Chart Placeholder */}
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('dashboard.performance')}</span>
                        <Badge variant="secondary" className="text-green-600 dark:text-green-400">{t('dashboard.performanceChange')}</Badge>
                      </div>
                      <div className="h-20 bg-gradient-to-r from-forest-100 to-gold-100 dark:from-gray-700 dark:to-gray-600 rounded flex items-end space-x-1 p-2">
                        <div className="w-4 bg-forest-400 rounded-t" style={{ height: "40%" }}></div>
                        <div className="w-4 bg-forest-500 rounded-t" style={{ height: "60%" }}></div>
                        <div className="w-4 bg-forest-600 rounded-t" style={{ height: "80%" }}></div>
                        <div className="w-4 bg-gold-500 rounded-t" style={{ height: "100%" }}></div>
                        <div className="w-4 bg-gold-400 rounded-t" style={{ height: "70%" }}></div>
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
                  {t('sections.eliteAgent')} <span className="text-forest-600 dark:text-forest-400">{t('sections.platform')}</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.eliteAgentDescription')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest-100 dark:bg-forest-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="text-forest-600 dark:text-forest-400 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('features.globalNetwork')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('features.globalNetworkDescription')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="text-gold-600 dark:text-gold-400 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('features.performanceAnalytics')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('features.performanceAnalyticsDescription')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest-100 dark:bg-forest-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="text-forest-600 dark:text-forest-400 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('features.aiTools')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('features.aiToolsDescription')}</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setLocation("/agents")}
                className="px-8 py-4 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
{t('common.joinOurNetwork')}
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gold-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('sections.professional')} <span className="text-forest-600 dark:text-forest-400">{t('sections.plans')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              {t('sections.professionalDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Global 20 Plan */}
            <Card className="hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('pricing.global20')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t('pricing.global20Description')}</p>
                  <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">
                    $120<span className="text-lg font-normal">/mo</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('pricing.billedAnnuallySave', { amount: '$180' })}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.upToListings', { count: 20 })}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.globalAudience')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.additionalPortals')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.crmIntegration')}</span>
                  </li>
                </ul>
                
                <Button className="w-full py-3 bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600">
                  {t('pricing.getStarted')}
                </Button>
              </CardContent>
            </Card>

            {/* Global 50 Plan (Popular) */}
            <Card className="hover:shadow-2xl transition-all duration-300 relative border-2 border-gold-400 bg-white dark:bg-gray-900">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-2">{t('pricing.mostPopular')}</Badge>
              </div>
              
              <CardContent className="p-8 pt-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('pricing.global50')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t('pricing.global50Description')}</p>
                  <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">
                    $160<span className="text-lg font-normal">/mo</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('pricing.billedAnnuallySave', { amount: '$240' })}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.upToListings', { count: 50 })}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.globalAudience')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.additionalPortals')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.advancedCrmIntegration')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.prioritySupport')}</span>
                  </li>
                </ul>
                
                <Button className="w-full py-3 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white shadow-lg">
                  {t('pricing.getStarted')}
                </Button>
              </CardContent>
            </Card>

            {/* Global 100 Plan */}
            <Card className="hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('pricing.global100')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t('pricing.global100Description')}</p>
                  <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">
                    $240<span className="text-lg font-normal">/mo</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('pricing.billedAnnuallySave', { amount: '$360' })}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.upToListings', { count: 100 })}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.globalAudience')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.additionalPortals')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.fullCrmIntegration')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pricing.dedicatedAccountManager')}</span>
                  </li>
                </ul>
                
                <Button className="w-full py-3 bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600">
                  {t('pricing.getStarted')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enterprise Section */}
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('pricing.needHigherVolume')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{t('pricing.customSolutions')}</p>
                <Button className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-lg">
                  {t('pricing.contactSales')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Developer Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('sections.developer')} <span className="text-forest-600 dark:text-forest-400">{t('sections.solutions')}</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('sections.developerDescription')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center p-4 bg-forest-50 dark:bg-forest-900/20">
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-forest-600 dark:text-forest-400">6,531</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.activeProjects')}</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-4 bg-gold-50 dark:bg-gold-900/20">
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-gold-600 dark:text-gold-400">49,609</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.activeUnits')}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                  <span className="text-gray-700 dark:text-gray-300">{t('sections.featuredPlacement')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                  <span className="text-gray-700 dark:text-gray-300">{t('sections.luxuryPortalAccess')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                  <span className="text-gray-700 dark:text-gray-300">{t('sections.multiLanguageTranslation')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-forest-600 dark:text-forest-400 h-5 w-5" />
                  <span className="text-gray-700 dark:text-gray-300">{t('sections.dedicatedAccountManagement')}</span>
                </div>
              </div>

              <Button 
                onClick={() => setLocation("/developer")}
                className="px-8 py-4 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {t('sections.learnMore')}
              </Button>
            </div>

            {/* Developer Dashboard Preview */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Luxury resort development with modern architecture and landscaping" 
                className="rounded-2xl shadow-2xl w-full h-auto" 
              />
              
              {/* Floating Project Card */}
              <Card className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-xs">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-forest-100 dark:bg-forest-900 text-forest-600 dark:text-forest-400">{t('sections.newDevelopment')}</Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{t('sections.unitsAvailable', { count: 35 })}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Marina Residences</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">From €450,000</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>2-4 Beds</span>
                    <span>80-200 m²</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Blog/Insights Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('sections.market')} <span className="text-forest-600 dark:text-forest-400">{t('sections.insights')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('sections.marketInsightsDescription')}
            </p>
          </div>

          {blogLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post: any) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group bg-white dark:bg-gray-900">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="secondary" className="text-forest-600 dark:text-forest-400">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              onClick={() => setLocation("/blog")}
              className="px-8 py-4 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {t('sections.viewAllInsights')}
            </Button>
          </div>
        </div>
      </section>
      {/* Global Network Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Global <span className="text-forest-600 dark:text-forest-400">Network</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Partner with leading luxury property portals worldwide, including Mansion Global and Wall Street Journal Real Estate
            </p>
          </div>

          {/* Partner Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60 hover:opacity-100 transition-opacity duration-300">
            {[
              "Mansion Global",
              "WSJ Real Estate", 
              "Zoopla",
              "Immowelt",
              "Juwai",
              "Primelocation"
            ].map((partner, index) => (
              <Card key={index} className="bg-gray-100 dark:bg-gray-800 flex items-center justify-center h-20">
                <CardContent className="p-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{partner}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">150M+</div>
              <div className="text-gray-600 dark:text-gray-400">Potential Buyers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">80+</div>
              <div className="text-gray-600 dark:text-gray-400">Property Portals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">35+</div>
              <div className="text-gray-600 dark:text-gray-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">30+</div>
              <div className="text-gray-600 dark:text-gray-400">Languages</div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action Section - Join Today */}
      <section className="py-20 bg-gradient-to-br from-forest-600 to-forest-800 dark:from-forest-800 dark:to-forest-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('hero.joinPlatform')}
            </h2>
            <p className="text-xl text-forest-100 max-w-3xl mx-auto">
              {t('auth.joinPlatform')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Property Seeker */}
            <Card className="bg-white dark:bg-gray-900 hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('auth.propertySeeker')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('auth.seekerDescription')}
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {t('auth.features.globalAccess')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {t('auth.features.exclusiveProperties')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {t('auth.features.expertAgents')}
                  </div>
                </div>
                <Button 
                  onClick={() => setLocation("/signup")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {t('auth.createAccount')}
                </Button>
              </CardContent>
            </Card>

            {/* Real Estate Agent */}
            <Card className="bg-white dark:bg-gray-900 hover:shadow-2xl transition-all duration-300 group border-2 border-forest-500">
              <CardContent className="p-8 text-center relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-forest-600 text-white">
                  {t('pricing.mostPopular')}
                </Badge>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('auth.realEstateAgent')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('auth.agentDescription')}
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    List properties globally
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Advanced CRM & analytics
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Premium marketing tools
                  </div>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setLocation("/signup")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {t('auth.createAgentAccount')}
                  </Button>
                  <Button 
                    onClick={() => setLocation("/agent-pricing")}
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400"
                  >
                    {t('pricing.viewPricing')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Developer */}
            <Card className="bg-white dark:bg-gray-900 hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('auth.propertyDeveloper')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('auth.developerDescription')}
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Showcase projects worldwide
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Connect with investors
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Project management tools
                  </div>
                </div>
                <Button 
                  onClick={() => setLocation("/signup")}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {t('auth.createDeveloperAccount')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
