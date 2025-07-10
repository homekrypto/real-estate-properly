import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocalization } from "@/lib/localization";
import { 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Eye,
  Phone,
  Mail,
  CheckCircle,
  ArrowLeft,
  Send
} from "lucide-react";
import { Link } from "wouter";

export default function PropertyDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { formatCurrency, formatDate, formatNumber, formatArea } = useLocalization();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState("");

  const { data: property, isLoading } = useQuery({
    queryKey: ["/api/properties", id],
    enabled: !!id,
  });

  const saveMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      return await apiRequest("POST", "/api/saved-properties", { propertyId });
    },
    onSuccess: () => {
      toast({
        title: t("propertyDetail.propertySaved"),
        description: t("propertyDetail.propertySavedDescription"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-properties"] });
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: t("common.errorTryAgain"),
        variant: "destructive",
      });
    },
  });

  const messageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      return await apiRequest("POST", "/api/messages", messageData);
    },
    onSuccess: () => {
      toast({
        title: t("propertyDetail.messageSent"),
        description: t("propertyDetail.messageSentDescription"),
      });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: t("common.errorTryAgain"),
        variant: "destructive",
      });
    },
  });

  const handleSaveProperty = () => {
    if (!isAuthenticated) {
      toast({
        title: t("propertyDetail.loginRequired"),
        description: t("propertyDetail.loginRequiredSave"),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
    saveMutation.mutate(parseInt(id!));
  };

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast({
        title: t("propertyDetail.loginRequired"),
        description: t("propertyDetail.loginRequiredContact"),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }

    if (!message.trim()) {
      toast({
        title: t("propertyDetail.messageRequired"),
        description: t("propertyDetail.messageRequiredDescription"),
        variant: "destructive",
      });
      return;
    }

    messageMutation.mutate({
      toUserId: property.agentId,
      propertyId: parseInt(id!),
      subject: `${t("propertyDetail.inquiryAbout")} ${property.title}`,
      message: message.trim(),
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: t("propertyDetail.linkCopied"),
        description: t("propertyDetail.linkCopiedDescription"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="pt-20">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <Skeleton className="w-32 h-8 mb-6" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="w-full h-96 rounded-2xl mb-6" />
                <Skeleton className="w-full h-32 mb-6" />
                <Skeleton className="w-full h-64" />
              </div>
              <div>
                <Skeleton className="w-full h-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="pt-20">
          <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("propertyDetail.propertyNotFound")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t("propertyDetail.propertyNotFoundDescription")}
            </p>
            <Link href="/search">
              <Button className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white">
                {t("propertyDetail.browseProperties")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/search" className="hover:text-forest-600 dark:hover:text-forest-400 flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t("propertyDetail.backToSearch")}
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="mb-8">
                <div className="relative rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={property.images[currentImageIndex]} 
                    alt={property.title}
                    className="w-full h-96 object-cover" 
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-forest-600 text-white">
                      {property.listingType === "sale" ? t("propertyDetail.forSale") : t("propertyDetail.forRent")}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleShare}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleSaveProperty}
                      disabled={saveMutation.isPending}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Image Thumbnails */}
                {property.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.slice(0, 4).map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative rounded-lg overflow-hidden aspect-square ${
                          currentImageIndex === index ? "ring-2 ring-forest-600" : ""
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${property.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform" 
                        />
                        {index === 3 && property.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                            +{property.images.length - 4}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Info */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="font-luxury text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                      <MapPin className="mr-1 h-4 w-4" />
                      {property.address}, {property.city}, {property.region}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-forest-600 dark:text-forest-400 mb-2">
                      {formatCurrency(Number(property.price))}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Eye className="mr-1 h-4 w-4" />
                      {formatNumber(property.views || 0)} {t("propertyDetail.viewsCount")}
                    </div>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Bed className="h-6 w-6 text-forest-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {property.bedrooms}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("propertyDetail.bedrooms")}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Bath className="h-6 w-6 text-forest-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {property.bathrooms}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("propertyDetail.bathrooms")}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Square className="h-6 w-6 text-forest-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatArea(property.squareMeters)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {property.propertyType}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("propertyDetail.type")}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Calendar className="h-6 w-6 text-forest-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDate(property.createdAt)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("propertyDetail.listedOn")}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("propertyDetail.verified")}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("propertyDetail.status")}</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t("propertyDetail.description")}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      {t("propertyDetail.featuresAmenities")}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                {/* Contact Form */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t("propertyDetail.contactForm")}
                  </h3>
                  <div className="space-y-4">
                    <Textarea
                      placeholder={t("propertyDetail.messagePlaceholder")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={messageMutation.isPending}
                      className="w-full bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {messageMutation.isPending ? t("propertyDetail.sendingMessage") : t("propertyDetail.sendMessage")}
                    </Button>
                  </div>
                </div>

                {/* Agent Info */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {property.agentId?.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {property.agentId || "Property Agent"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t("propertyDetail.licenseInfo")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="mr-2 h-4 w-4" />
                      {t("propertyDetail.callAgent")}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="mr-2 h-4 w-4" />
                      {t("propertyDetail.emailAgent")}
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <div className="space-y-3">
                    <Button 
                      onClick={handleSaveProperty}
                      disabled={saveMutation.isPending}
                      variant="outline" 
                      className="w-full"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      {saveMutation.isPending ? "Saving..." : "Save Property"}
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Viewing
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
