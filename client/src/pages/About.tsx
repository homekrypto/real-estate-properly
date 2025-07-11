import { useTranslation } from 'react-i18next';
import { 
  Crown, Globe, Users, Award, TrendingUp, Heart,
  Target, Eye, Shield, Handshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { value: '200K+', label: t('about.stats.professionals') },
    { value: '150M+', label: t('about.stats.buyers') },
    { value: '35+', label: t('about.stats.countries') },
    { value: '80+', label: t('about.stats.portals') },
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description'),
      color: 'bg-blue-600',
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: t('about.values.transparency.title'),
      description: t('about.values.transparency.description'),
      color: 'bg-green-600',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('about.values.trust.title'),
      description: t('about.values.trust.description'),
      color: 'bg-purple-600',
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: t('about.values.partnership.title'),
      description: t('about.values.partnership.description'),
      color: 'bg-orange-600',
    },
  ];

  const milestones = [
    {
      year: '2018',
      title: t('about.milestones.2018.title'),
      description: t('about.milestones.2018.description'),
    },
    {
      year: '2019',
      title: t('about.milestones.2019.title'),
      description: t('about.milestones.2019.description'),
    },
    {
      year: '2021',
      title: t('about.milestones.2021.title'),
      description: t('about.milestones.2021.description'),
    },
    {
      year: '2023',
      title: t('about.milestones.2023.title'),
      description: t('about.milestones.2023.description'),
    },
    {
      year: '2025',
      title: t('about.milestones.2025.title'),
      description: t('about.milestones.2025.description'),
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: t('about.team.ceo.role'),
      bio: t('about.team.ceo.bio'),
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    },
    {
      name: 'Michael Chen',
      role: t('about.team.cto.role'),
      bio: t('about.team.cto.bio'),
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    },
    {
      name: 'Elena Rodriguez',
      role: t('about.team.coo.role'),
      bio: t('about.team.coo.bio'),
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b776?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Crown className="h-10 w-10 text-forest-600 dark:text-forest-400" />
            <h1 className="font-luxury text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white">
              {t('about.title')} <span className="text-forest-600 dark:text-forest-400">{t('about.properly')}</span>
            </h1>
          </div>
          <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="floating-card text-center">
              <CardContent className="p-8">
                <div className="text-4xl lg:text-5xl font-bold text-forest-600 dark:text-forest-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <Card className="luxury-shadow">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('about.mission.title')}
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('about.mission.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="luxury-shadow">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 luxury-gradient-gold rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('about.vision.title')}
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('about.vision.description')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.story.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('about.story.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('about.story.paragraph1')}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('about.story.paragraph2')}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('about.story.paragraph3')}
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Properly team"
                className="rounded-2xl luxury-shadow w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl p-4 luxury-shadow border border-border animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 luxury-gradient-gold rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{t('about.award.title')}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('about.award.year')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="floating-card text-center">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${value.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <div className="text-white">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.timeline.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('about.timeline.subtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-forest-200 dark:bg-forest-700 lg:left-1/2 lg:transform lg:-translate-x-1/2"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-forest-600 rounded-full border-4 border-white dark:border-gray-800 lg:left-1/2 lg:transform lg:-translate-x-1/2"></div>
                  
                  <div className={`ml-16 lg:ml-0 lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <Card className="floating-card">
                      <CardContent className="p-6">
                        <Badge className="bg-forest-600 text-white mb-3">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.team.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="floating-card text-center">
                <CardContent className="p-8">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-forest-600 dark:text-forest-400 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.contact.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('about.contact.subtitle')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 luxury-shadow border border-border">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="mb-2 text-gray-600 dark:text-gray-400">Have questions or feedback? Reach out to our team:</p>
            <ul className="mb-6 list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li>Email: <a href="mailto:support@properly.com" className="text-blue-600 dark:text-blue-400 underline">support@properly.com</a></li>
              <li>Phone: <a href="tel:+1234567890" className="text-blue-600 dark:text-blue-400 underline">+1 234 567 890</a></li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="luxury-shadow bg-gradient-to-r from-forest-600 to-forest-700 border-0">
            <CardContent className="p-12">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Heart className="h-8 w-8 text-white" />
                <h2 className="font-luxury text-3xl lg:text-4xl font-bold text-white">
                  {t('about.cta.title')}
                </h2>
              </div>
              <p className="text-xl text-forest-100 mb-8 max-w-2xl mx-auto">
                {t('about.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-white text-forest-700 hover:bg-gray-100 px-8 py-3 font-semibold">
                    {t('about.cta.contact')}
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-forest-700 px-8 py-3 font-semibold">
                    {t('about.cta.pricing')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
