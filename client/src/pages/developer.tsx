import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2,
  Globe,
  Languages,
  TrendingUp,
  Users,
  Mail,
  CheckCircle,
  Star,
  BarChart3,
  Shield,
  Zap,
  Award,
  Phone,
  MapPin
} from "lucide-react";

export default function Developer() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Layout>
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-forest-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-8">
                <div>
                  <Badge className="bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-200 mb-4">
                    Developer Solutions
                  </Badge>
                  <h1 className="font-luxury text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                    Engage & Sell to <span className="text-forest-600 dark:text-forest-400">Global Buyers</span>
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    International and local advertising for new development condominiums, townhomes, house and land packages.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Card className="text-center p-4 bg-forest-50 dark:bg-forest-900/20">
                    <CardContent className="p-4">
                      <div className="text-3xl font-bold text-forest-600 dark:text-forest-400 mb-2">6,531</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center p-4 bg-gold-50 dark:bg-gold-900/20">
                    <CardContent className="p-4">
                      <div className="text-3xl font-bold text-gold-600 dark:text-gold-400 mb-2">49,609</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Active Units</div>
                    </CardContent>
                  </Card>
                </div>

                <Button className="px-8 py-4 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  Get in Touch
                </Button>
              </div>

              {/* Image */}
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
                      <Badge className="bg-forest-100 dark:bg-forest-900 text-forest-600 dark:text-forest-400">New Development</Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">35 units available</span>
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

        {/* Benefits Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Your Benefits Advertising With Us
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Experience a new level of efficiency and success in your real estate developments with our dedicated features
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-forest-100 dark:bg-forest-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="text-forest-600 dark:text-forest-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Be on Top</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Projects and their units are featured at the top of all search results with the largest listing display size.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Globe className="text-gold-600 dark:text-gold-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">ListGlobally Network</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Your listings reach an international audience and receive leads from portals all around the world.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-forest-100 dark:bg-forest-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Award className="text-forest-600 dark:text-forest-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Luxury Network</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Access to the world leading luxury real estate portals including Mansion Global and Wall Street Journal.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Languages className="text-gold-600 dark:text-gold-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Translation System</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Project details and unit information are translated into 30+ different languages.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-forest-100 dark:bg-forest-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="text-forest-600 dark:text-forest-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Account Support</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Dedicated Properly Account Manager overseeing the management of your advertised projects.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="text-gold-600 dark:text-gold-400 h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Email Marketing</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Connect with millions of interested buyers through Properly's email campaigns.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Global Reach & Impact
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">+4M</div>
                <div className="text-gray-600 dark:text-gray-400">Visits per month</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">+35</div>
                <div className="text-gray-600 dark:text-gray-400">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">+150M</div>
                <div className="text-gray-600 dark:text-gray-400">Potential buyers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-forest-600 dark:text-forest-400 mb-2">+45</div>
                <div className="text-gray-600 dark:text-gray-400">Portals</div>
              </div>
            </div>
          </div>
        </section>

        {/* Network Partners */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Premium Portal Network
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Your developments will be featured on world-leading luxury real estate portals
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { name: "Mansion Global", country: "Global" },
                { name: "Wall Street Journal", country: "Global" },
                { name: "Zoopla", country: "United Kingdom" },
                { name: "Immowelt", country: "Germany" },
                { name: "Juwai", country: "China" },
                { name: "Primelocation", country: "United Kingdom" },
                { name: "Bellevue", country: "Germany" },
                { name: "Lux-Residence", country: "France" },
                { name: "BellesDemeures", country: "France" },
                { name: "Immovlan", country: "Belgium" },
                { name: "Immowelt.at", country: "Austria" },
                { name: "Juwai.asia", country: "Global" }
              ].map((portal, index) => (
                <Card key={index} className="p-4 text-center hover:shadow-lg transition-all duration-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-0">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {portal.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {portal.country}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-gradient-to-br from-forest-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Get in Touch
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Over 200,000 real estate professionals around the world are currently partnered with Properly. Why not you?
                </p>
              </div>

              <Card className="p-8 bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Company name *
                        </label>
                        <Input placeholder="Your company name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Full name *
                        </label>
                        <Input placeholder="Your full name" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email address *
                        </label>
                        <Input type="email" placeholder="your@email.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone *
                        </label>
                        <Input placeholder="Your phone number" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Your CRM/Software where you manage your properties *
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your CRM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="custom">Custom Solution</SelectItem>
                          <SelectItem value="salesforce">Salesforce</SelectItem>
                          <SelectItem value="hubspot">HubSpot</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        What describes you best? *
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="developer">Property Developer</SelectItem>
                          <SelectItem value="agency">Real Estate Agency</SelectItem>
                          <SelectItem value="agent">Individual Agent</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Message *
                      </label>
                      <Textarea 
                        placeholder="Tell us about your development projects and requirements"
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Request More Information
                    </Button>

                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Already have an account? <a href="/api/login" className="text-forest-600 dark:text-forest-400 hover:underline">Sign in here</a>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      {/* Footer is included in Layout */}
      </Layout>
    </div>
  );
}
