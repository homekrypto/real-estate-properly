import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { 
  Heart, Share2, MapPin, Bed, Bath, Ruler, Car, 
  Wifi, Waves, TreePine, Star, Eye, Calendar,
  Phone, Mail, MessageCircle, ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Property {
  id: number;
  title: string;
  description: string;
  price: string;
  currency: string;
  country: string;
  region: string;
  city: string;
  address: string;
  propertyType: string;
  listingType: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  features: string[];
  images: string[];
  views: number;
  agentId: number;
  createdAt: string;
}

interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
  bio: string;
  phone: string;
  email: string;
}

export default function PropertyDetail() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [match, params] = useRoute('/property/:id');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const propertyId = params?.id ? parseInt(params.id) : 0;

  // Fetch property details
  const { data: property, isLoading: propertyLoading } = useQuery<Property>({
    queryKey: ['/api/properties', propertyId],
    enabled: !!propertyId,
  });

  // Fetch agent details
  const { data: agent } = useQuery<Agent>({
    queryKey: ['/api/users', property?.agentId],
    enabled: !!property?.agentId,
  });

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/favorites', {
        userId: 1, // TODO: Get from auth context
        propertyId: propertyId,
      });
    },
    onSuccess: () => {
      toast({
        title: t('property.addedToFavorites'),
        description: t('property.favoriteSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', 1, 'favorites'] });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('property.favoriteError'),
        variant: 'destructive',
      });
    },
  });

  // Contact agent mutation
  const contactAgentMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/messages', {
        fromUserId: 1, // TODO: Get from auth context
        toUserId: property?.agentId,
        propertyId: propertyId,
        subject: `Inquiry about ${property?.title}`,
        message: contactForm.message,
      });
    },
    onSuccess: () => {
      toast({
        title: t('property.messageSent'),
        description: t('property.messageSuccess'),
      });
      setContactForm({ name: '', email: '', phone: '', message: '' });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('property.messageError'),
        variant: 'destructive',
      });
    },
  });

  const formatPrice = (price: string, currency: string) => {
    const num = parseFloat(price);
    return `${currency}${num.toLocaleString()}`;
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.message.trim()) {
      toast({
        title: t('common.error'),
        description: t('property.messageRequired'),
        variant: 'destructive',
      });
      return;
    }
    contactAgentMutation.mutate();
  };

  if (propertyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('property.notFound')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('property.notFoundDescription')}
            </p>
            <Link href="/search">
              <Button className="luxury-button">
                {t('property.backToSearch')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/search">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
        </Link>

        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden luxury-shadow">
            <img
              src={property.images?.[currentImageIndex] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {property.images && property.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {property.images?.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Property Type Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-forest-600 text-white text-sm">
              {t(`propertyTypes.${property.propertyType}`)}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/90 hover:bg-white"
              onClick={() => addToFavoritesMutation.mutate()}
              disabled={addToFavoritesMutation.isPending}
            >
              <Heart className="h-5 w-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/90 hover:bg-white"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 mb-4">
                    <MapPin className="h-5 w-5" />
                    <span>{property.address}, {property.city}, {property.region}, {property.country}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-forest-600 dark:text-forest-400">
                    {formatPrice(property.price, property.currency)}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <Eye className="h-4 w-4" />
                    <span>{property.views} {t('property.views')}</span>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-border">
                  <Bed className="h-5 w-5 text-forest-600 dark:text-forest-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('property.bedrooms')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-border">
                  <Bath className="h-5 w-5 text-forest-600 dark:text-forest-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('property.bathrooms')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-border">
                  <Ruler className="h-5 w-5 text-forest-600 dark:text-forest-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{property.area}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">m²</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-border">
                  <Calendar className="h-5 w-5 text-forest-600 dark:text-forest-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{new Date(property.createdAt).getFullYear()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('property.listed')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="luxury-shadow">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('property.description')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Features & Amenities */}
            <Card className="luxury-shadow">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('property.features')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features?.map((feature, index) => {
                    const getFeatureIcon = (feature: string) => {
                      switch (feature) {
                        case 'swimming_pool': return <Waves className="h-5 w-5" />;
                        case 'garage': return <Car className="h-5 w-5" />;
                        case 'wifi': return <Wifi className="h-5 w-5" />;
                        case 'garden': return <TreePine className="h-5 w-5" />;
                        default: return <Star className="h-5 w-5" />;
                      }
                    };

                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-forest-50 dark:bg-forest-900/20 rounded-lg">
                        <div className="text-forest-600 dark:text-forest-400">
                          {getFeatureIcon(feature)}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 capitalize">
                          {feature.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card className="luxury-shadow">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('property.location')}
                </h2>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">{t('property.mapPlaceholder')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            {agent && (
              <Card className="luxury-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-forest-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {agent.firstName?.[0]}{agent.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {agent.firstName} {agent.lastName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{agent.company}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    {agent.bio}
                  </p>

                  <div className="space-y-3">
                    <Button className="w-full luxury-button">
                      <Phone className="h-4 w-4 mr-2" />
                      {t('property.callAgent')}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      {t('property.emailAgent')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Form */}
            <Card className="luxury-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('property.contactAgent')}
                </h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <Input
                    placeholder={t('contact.name')}
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    type="email"
                    placeholder={t('contact.email')}
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    type="tel"
                    placeholder={t('contact.phone')}
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Textarea
                    placeholder={t('property.messageAgent')}
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                  <Button 
                    type="submit" 
                    className="w-full luxury-button"
                    disabled={contactAgentMutation.isPending}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {contactAgentMutation.isPending ? t('common.sending') : t('property.sendMessage')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="luxury-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('property.quickActions')}
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('property.scheduleViewing')}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Star className="h-4 w-4 mr-2" />
                    {t('property.requestInfo')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
