import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe,
  BarChart3,
  Bot,
  CheckCircle,
  TrendingUp,
  Users,
  MessageSquare,
  Shield,
  Star,
  ArrowRight
} from "lucide-react";

export default function Agents() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Layout>
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-forest-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-luxury text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {t("agents.title")}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {t("agents.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="px-8 py-4 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  {t("agents.startFreeTrial")}
                </Button>
                <Button variant="outline" className="px-8 py-4 text-lg border-forest-600 text-forest-600 hover:bg-forest-50 dark:border-forest-400 dark:text-forest-400 dark:hover:bg-forest-900/20">
                  {t("agents.watchDemo")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("agents.whyChooseUs")}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("agents.whyChooseUsDescription")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-forest-100 dark:bg-forest-900 rounded-2xl flex items-center justify-center mb-6">
                    <Globe className="text-forest-600 dark:text-forest-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("agents.globalReach")}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t("agents.globalReachDescription")}
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-2xl flex items-center justify-center mb-6">
                    <BarChart3 className="text-gold-600 dark:text-gold-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Advanced Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Track performance metrics, lead activity, and promotion effectiveness with detailed real-time analytics.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-forest-100 dark:bg-forest-900 rounded-2xl flex items-center justify-center mb-6">
                    <Bot className="text-forest-600 dark:text-forest-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Tools</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Leverage AI for property extraction with 96% accuracy and automated buyer matching technology.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-2xl flex items-center justify-center mb-6">
                    <TrendingUp className="text-gold-600 dark:text-gold-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lead Generation</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Access qualified international buyers actively searching for luxury properties in your market.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-forest-100 dark:bg-forest-900 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="text-forest-600 dark:text-forest-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">CRM Integration</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Seamlessly integrate with your existing CRM and workflow management systems.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="text-gold-600 dark:text-gold-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Premium Support</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Dedicated account management and 24/7 priority support to ensure your success.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Agents Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Join thousands of successful agents already using Properly
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gold-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                    "Properly transformed my business. I'm now reaching buyers from 15 different countries and my listings get 300% more views."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">MS</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Maria Silva</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Luxury Properties Barcelona</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gold-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                    "The analytics dashboard is incredible. I can track exactly which portals are generating leads and optimize my strategy."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">JM</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">James Mitchell</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Prime London Properties</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gold-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                    "Being featured on Mansion Global and WSJ has elevated my brand. Clients now see me as a true luxury specialist."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">AP</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Anna Petrov</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Monaco Elite Estates</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-forest-600 to-forest-800 dark:from-forest-700 dark:to-forest-900">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Go Global?
            </h2>
            <p className="text-xl text-forest-100 mb-8 max-w-2xl mx-auto">
              Join over 200,000 real estate professionals worldwide and start reaching international buyers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="px-8 py-4 bg-white text-forest-600 hover:bg-gray-100 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Start Free 14-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer is included in Layout */}
      </Layout>
    </div>
  );
}
