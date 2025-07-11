import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star, Crown, Zap, Users, BarChart3, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Layout } from "@/components/Layout";

export default function Pricing() {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(true);

  const features = [
    {
      icon: <Check className="h-8 w-8" />,
      title: t('pricing.benefits.global.title'),
      description: t('pricing.benefits.global.description'),
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: t('pricing.benefits.analytics.title'),
      description: t('pricing.benefits.analytics.description'),
    },
    {
      icon: <Check className="h-8 w-8" />,
      title: t('pricing.benefits.network.title'),
      description: t('pricing.benefits.network.description'),
    },
    {
      icon: <Check className="h-8 w-8" />,
      title: t('pricing.benefits.ai.title'),
      description: t('pricing.benefits.ai.description'),
    },
  ];

  return (
    <Layout>
      <div className="w-full min-h-screen bg-gradient-to-br from-forest-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <p className="text-center text-lg mb-8 text-muted-foreground">{t('pricing.subtitle', 'Flexible plans for every agent. Pay monthly or save 20% with annual billing.')}</p>
          <div className="flex justify-center items-center mb-8 gap-2">
            <span className="text-sm">{t('pricing.monthly', 'Monthly')}</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className="text-sm">{t('pricing.annual', 'Annual (Save 20%)')}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Bronze Plan */}
            <Card className="shadow-lg border border-border bg-card">
              <CardContent className="p-6 flex flex-col items-center">
                <Badge className="mb-2 bg-gold-400 text-white">Bronze</Badge>
                <Crown className="h-8 w-8 mb-2 text-gold-400" />
                <h2 className="text-2xl font-semibold mb-2 text-forest-700 dark:text-forest-200">Plan Bronze</h2>
                <p className="mb-2 text-muted-foreground">5 adds / month</p>
                <div className="text-3xl font-bold mb-2 text-forest-700 dark:text-forest-200">${isAnnual ? 50 * 12 * 0.8 : 50} <span className="text-base font-normal">USD</span></div>
                <Button className="w-full mt-4" onClick={() => window.location.href = '/agentregister?plan=bronze_5'}>{t('pricing.getStarted', 'Get Started')}</Button>
              </CardContent>
            </Card>
            {/* Silver Plan */}
            <Card className="shadow-lg border border-border bg-card">
              <CardContent className="p-6 flex flex-col items-center">
                <Badge className="mb-2 bg-gray-400 text-white">Silver</Badge>
                <Zap className="h-8 w-8 mb-2 text-gray-400" />
                <h2 className="text-2xl font-semibold mb-2 text-forest-700 dark:text-forest-200">Plan Silver</h2>
                <p className="mb-2 text-muted-foreground">20 adds / month</p>
                <div className="text-3xl font-bold mb-2 text-forest-700 dark:text-forest-200">${isAnnual ? 80 * 12 * 0.8 : 80} <span className="text-base font-normal">USD</span></div>
                <Button className="w-full mt-4" onClick={() => window.location.href = '/agentregister?plan=silver_20'}>{t('pricing.getStarted', 'Get Started')}</Button>
              </CardContent>
            </Card>
            {/* Gold Plan */}
            <Card className="shadow-lg border border-border bg-card">
              <CardContent className="p-6 flex flex-col items-center">
                <Badge className="mb-2 bg-gold-700 text-white">Gold</Badge>
                <Star className="h-8 w-8 mb-2 text-gold-700" />
                <h2 className="text-2xl font-semibold mb-2 text-forest-700 dark:text-forest-200">Plan Gold</h2>
                <p className="mb-2 text-muted-foreground">50 adds / month</p>
                <div className="text-3xl font-bold mb-2 text-forest-700 dark:text-forest-200">${isAnnual ? 110 * 12 * 0.8 : 110} <span className="text-base font-normal">USD</span></div>
                <Button className="w-full mt-4" onClick={() => window.location.href = '/agentregister?plan=gold_50'}>{t('pricing.getStarted', 'Get Started')}</Button>
              </CardContent>
            </Card>
          </div>
          <h3 className="text-2xl font-bold text-center mb-6 text-forest-800 dark:text-forest-300">{t('pricing.featuresTitle', 'All Plans Include')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, idx) => (
              <Card key={idx} className="shadow border border-border bg-card">
                <CardContent className="flex items-center gap-4 p-4">
                  {feature.icon}
                  <div>
                    <div className="font-semibold text-forest-700 dark:text-forest-200">{feature.title}</div>
                    <div className="text-muted-foreground text-sm">{feature.description}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" className="px-8 py-4 text-lg font-bold" onClick={() => window.location.href = '/agentregister'}>
              {t('pricing.cta', 'Start Your Agent Journey')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
