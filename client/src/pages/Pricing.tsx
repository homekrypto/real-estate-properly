import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star, Crown, Zap, Globe, Users, BarChart3, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  popular?: boolean;
  cta: string;
}

export default function Pricing() {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(true);

  const plans: PricingPlan[] = [
    {
      id: 'global_20',
      name: t('pricing.plans.global20.name'),
      description: t('pricing.plans.global20.description'),
      monthlyPrice: 150,
      annualPrice: 120,
      features: [
        t('pricing.features.listings20'),
        t('pricing.features.globalAudience'),
        t('pricing.features.additionalPortals'),
        t('pricing.features.crmIntegration'),
        t('pricing.features.basicSupport'),
      ],
      cta: t('pricing.getStarted'),
    },
    {
      id: 'global_50',
      name: t('pricing.plans.global50.name'),
      description: t('pricing.plans.global50.description'),
      monthlyPrice: 200,
      annualPrice: 160,
      features: [
        t('pricing.features.listings50'),
        t('pricing.features.globalAudience'),
        t('pricing.features.additionalPortals'),
        t('pricing.features.advancedCRM'),
        t('pricing.features.prioritySupport'),
        t('pricing.features.performanceAnalytics'),
      ],
      popular: true,
      cta: t('pricing.getStarted'),
    },
    {
      id: 'global_100',
      name: t('pricing.plans.global100.name'),
      description: t('pricing.plans.global100.description'),
      monthlyPrice: 300,
      annualPrice: 240,
      features: [
        t('pricing.features.listings100'),
        t('pricing.features.globalAudience'),
        t('pricing.features.additionalPortals'),
        t('pricing.features.fullCRM'),
        t('pricing.features.dedicatedManager'),
        t('pricing.features.advancedAnalytics'),
        t('pricing.features.customBranding'),
      ],
      cta: t('pricing.getStarted'),
    },
  ];

  const features = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: t('pricing.benefits.global.title'),
      description: t('pricing.benefits.global.description'),
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: t('pricing.benefits.analytics.title'),
      description: t('pricing.benefits.analytics.description'),
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('pricing.benefits.network.title'),
      description: t('pricing.benefits.network.description'),
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t('pricing.benefits.ai.title'),
      description: t('pricing.benefits.ai.description'),
    },
  ];

  const getPrice = (plan: PricingPlan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: PricingPlan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const annualCost = plan.annualPrice * 12;
    return monthlyCost - annualCost;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gold-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="h-8 w-8 text-gold-500" />
            <h1 className="font-luxury text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              {t('pricing.title')} <span className="text-forest-600 dark:text-forest-400">{t('pricing.plans.title')}</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            {t('pricing.subtitle')}
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-lg font-medium ${!isAnnual ? 'text-forest-600 dark:text-forest-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {t('pricing.monthly')}
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-forest-600"
            />
            <span className={`text-lg font-medium ${isAnnual ? 'text-forest-600 dark:text-forest-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {t('pricing.annual')}
            </span>
            {isAnnual && (
              <Badge className="bg-gold-500 text-white">
                {t('pricing.save20')}
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`floating-card relative ${
                plan.popular 
                  ? 'border-2 border-gold-400 ring-4 ring-gold-400/20' 
                  : 'border border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="luxury-gradient-gold text-white px-6 py-2 text-sm font-semibold">
                    <Star className="h-4 w-4 mr-1" />
                    {t('pricing.mostPopular')}
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="text-5xl font-bold text-forest-600 dark:text-forest-400">
                      ${getPrice(plan)}
                      <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                        /{t('pricing.month')}
                      </span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        {t('pricing.save')} ${getSavings(plan)} {t('pricing.annually')}
                      </p>
                    )}
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-forest-600 dark:text-forest-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 font-semibold transition-all duration-200 ${
                    plan.popular 
                      ? 'luxury-button' 
                      : 'bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise Section */}
        <div className="text-center mb-20">
          <Card className="luxury-shadow max-w-4xl mx-auto">
            <CardContent className="p-12">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Crown className="h-8 w-8 text-gold-500" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('pricing.enterprise.title')}
                </h2>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {t('pricing.enterprise.description')}
              </p>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="text-center p-6 bg-forest-50 dark:bg-forest-900/20 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('pricing.enterprise.volume.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('pricing.enterprise.volume.description')}
                  </p>
                </div>
                <div className="text-center p-6 bg-gold-50 dark:bg-gold-900/20 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('pricing.enterprise.developers.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('pricing.enterprise.developers.description')}
                  </p>
                </div>
              </div>
              <Button className="luxury-gradient-gold text-white px-8 py-3 font-semibold">
                {t('pricing.enterprise.contact')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-luxury text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('pricing.benefits.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('pricing.benefits.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="floating-card text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 luxury-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <Card className="luxury-shadow">
            <CardContent className="p-12">
              <h2 className="font-luxury text-3xl font-bold text-gray-900 dark:text-white mb-8">
                {t('pricing.stats.title')}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">200K+</div>
                  <div className="text-gray-600 dark:text-gray-400">{t('pricing.stats.professionals')}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">150M+</div>
                  <div className="text-gray-600 dark:text-gray-400">{t('pricing.stats.buyers')}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">80+</div>
                  <div className="text-gray-600 dark:text-gray-400">{t('pricing.stats.portals')}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">35+</div>
                  <div className="text-gray-600 dark:text-gray-400">{t('pricing.stats.countries')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="font-luxury text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('pricing.faq.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="floating-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t(`pricing.faq.question${i}`)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t(`pricing.faq.answer${i}`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <Card className="luxury-shadow bg-gradient-to-r from-forest-600 to-forest-700 border-0">
            <CardContent className="p-12">
              <h2 className="font-luxury text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('pricing.cta.title')}
              </h2>
              <p className="text-xl text-forest-100 mb-8 max-w-2xl mx-auto">
                {t('pricing.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-forest-700 hover:bg-gray-100 px-8 py-3 font-semibold">
                  {t('pricing.cta.start')}
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-forest-700 px-8 py-3 font-semibold">
                  <Headphones className="h-4 w-4 mr-2" />
                  {t('pricing.cta.contact')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
