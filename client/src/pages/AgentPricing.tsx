import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Star, Building, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocalization } from "@/lib/localization";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  propertyLimit: number;
  features: string[];
}

export default function AgentPricing() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { formatCurrency } = useLocalization();
  const [isAnnual, setIsAnnual] = useState(false);

  // Fetch subscription plans
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["/api/subscription-plans"],
    queryFn: async () => {
      const response = await apiRequest("/api/subscription-plans", "GET");
      return response.json();
    },
  });

  // Create Stripe checkout session
  const createCheckoutMutation = useMutation({
    mutationFn: async ({ planId, isAnnual }: { planId: string; isAnnual: boolean }) => {
      const response = await apiRequest("/api/stripe/create-checkout", "POST", {
        planId,
        billingPeriod: isAnnual ? "annual" : "monthly",
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      window.location.href = data.checkoutUrl;
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleChoosePlan = (planId: string) => {
    createCheckoutMutation.mutate({ planId, isAnnual });
  };

  const getPrice = (plan: SubscriptionPlan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: SubscriptionPlan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.annualPrice;
    return Math.round((savings / monthlyCost) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('pricing.chooseYourPlan')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            {t('pricing.unlockGlobalReach')}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              {t('pricing.monthly')}
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-green-600"
            />
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              {t('pricing.annual')}
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {t('pricing.save')} 10%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan: SubscriptionPlan, index: number) => {
            const isPopular = plan.id === "silver";
            const price = getPrice(plan);
            const savings = getSavings(plan);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden ${
                  isPopular 
                    ? 'border-2 border-blue-500 shadow-xl scale-105' 
                    : 'border border-gray-200 dark:border-gray-700'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-2 text-sm font-medium">
                    <Star className="inline h-4 w-4 mr-1" />
                    {t('pricing.mostPopular')}
                  </div>
                )}
                
                <CardHeader className={`text-center ${isPopular ? 'pt-12' : 'pt-6'}`}>
                  <div className="mx-auto mb-4">
                    {plan.id === 'bronze' && <Building className="h-12 w-12 text-orange-500" />}
                    {plan.id === 'silver' && <Zap className="h-12 w-12 text-blue-500" />}
                    {plan.id === 'gold' && <Star className="h-12 w-12 text-yellow-500" />}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(price)}
                      <span className="text-lg text-gray-500 font-normal">
                        /{isAnnual ? t('pricing.year') : t('pricing.month')}
                      </span>
                    </div>
                    
                    {isAnnual && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        {t('pricing.save')} {savings}% {t('pricing.annually')}
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature: string, featureIndex: number) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-6">
                    <Button
                      onClick={() => handleChoosePlan(plan.id)}
                      disabled={createCheckoutMutation.isPending}
                      className={`w-full ${
                        isPopular
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                          : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                      }`}
                    >
                      {createCheckoutMutation.isPending ? 
                        t('pricing.processing') : 
                        t('pricing.choosePlan')
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enterprise Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('pricing.needHigherVolume')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t('pricing.customSolutions')}
              </p>
              <Button 
                onClick={() => setLocation("/contact")}
                className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-lg"
              >
                {t('pricing.contactSales')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t('pricing.featuresComparison')}
          </h2>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="font-semibold text-gray-900 dark:text-white">
                {t('pricing.features')}
              </div>
              <div className="text-center font-semibold text-gray-900 dark:text-white">
                Bronze
              </div>
              <div className="text-center font-semibold text-gray-900 dark:text-white">
                Silver
              </div>
              <div className="text-center font-semibold text-gray-900 dark:text-white">
                Gold
              </div>
            </div>
            
            {/* Feature rows would go here */}
            <div className="p-6 text-center text-gray-600 dark:text-gray-300">
              {t('pricing.detailedComparison')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}