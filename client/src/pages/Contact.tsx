import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { 
  Mail, Phone, MapPin, Clock, Send, MessageCircle,
  Building, Users, Globe, Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: '',
  });

  // Submit contact form mutation
  const submitContactMutation = useMutation({
    mutationFn: async (formData: typeof contactForm) => {
      // In a real app, this would send to a contact endpoint
      await apiRequest('POST', '/api/contact', formData);
    },
    onSuccess: () => {
      toast({
        title: t('contact.messageSent'),
        description: t('contact.messageSuccess'),
      });
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: '',
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('contact.messageError'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: t('common.error'),
        description: t('contact.fillRequired'),
        variant: 'destructive',
      });
      return;
    }
    submitContactMutation.mutate(contactForm);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: t('contact.email'),
      value: 'hello@properly.com',
      description: t('contact.emailDescription'),
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: t('contact.phone'),
      value: '+1 (555) 123-4567',
      description: t('contact.phoneDescription'),
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t('contact.address'),
      value: t('contact.addressValue'),
      description: t('contact.addressDescription'),
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: t('contact.hours'),
      value: t('contact.hoursValue'),
      description: t('contact.hoursDescription'),
    },
  ];

  const inquiryTypes = [
    { value: 'general', label: t('contact.inquiryTypes.general') },
    { value: 'agent', label: t('contact.inquiryTypes.agent') },
    { value: 'developer', label: t('contact.inquiryTypes.developer') },
    { value: 'support', label: t('contact.inquiryTypes.support') },
    { value: 'partnership', label: t('contact.inquiryTypes.partnership') },
    { value: 'media', label: t('contact.inquiryTypes.media') },
  ];

  const departments = [
    {
      icon: <Users className="h-8 w-8" />,
      title: t('contact.departments.sales.title'),
      description: t('contact.departments.sales.description'),
      email: 'sales@properly.com',
      color: 'bg-blue-600',
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: t('contact.departments.support.title'),
      description: t('contact.departments.support.description'),
      email: 'support@properly.com',
      color: 'bg-green-600',
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: t('contact.departments.partnerships.title'),
      description: t('contact.departments.partnerships.description'),
      email: 'partnerships@properly.com',
      color: 'bg-purple-600',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: t('contact.departments.international.title'),
      description: t('contact.departments.international.description'),
      email: 'international@properly.com',
      color: 'bg-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MessageCircle className="h-8 w-8 text-forest-600 dark:text-forest-400" />
            <h1 className="font-luxury text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              {t('contact.title')} <span className="text-forest-600 dark:text-forest-400">{t('contact.us')}</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('contact.getInTouch')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('contact.name')} *
                      </label>
                      <Input
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={t('contact.namePlaceholder')}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('contact.email')} *
                      </label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder={t('contact.emailPlaceholder')}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('contact.phone')}
                      </label>
                      <Input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder={t('contact.phonePlaceholder')}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('contact.inquiryType')}
                      </label>
                      <Select 
                        value={contactForm.inquiryType} 
                        onValueChange={(value) => setContactForm(prev => ({ ...prev, inquiryType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('contact.selectInquiry')} />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('contact.subject')}
                    </label>
                    <Input
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder={t('contact.subjectPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('contact.message')} *
                    </label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder={t('contact.messagePlaceholder')}
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full luxury-button"
                    disabled={submitContactMutation.isPending}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submitContactMutation.isPending ? t('common.sending') : t('contact.sendMessage')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('contact.contactInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-white">
                        {info.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {info.title}
                      </h3>
                      <p className="text-forest-600 dark:text-forest-400 font-medium mb-1">
                        {info.value}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="luxury-shadow bg-gradient-to-br from-forest-50 to-gold-50 dark:from-forest-900/20 dark:to-gold-900/20">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {t('contact.urgentInquiry')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {t('contact.urgentDescription')}
                </p>
                <Button className="luxury-button w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  {t('contact.callNow')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Departments */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="font-luxury text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('contact.departments.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('contact.departments.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="floating-card text-center">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${dept.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <div className="text-white">
                      {dept.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {dept.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {dept.description}
                  </p>
                  <a
                    href={`mailto:${dept.email}`}
                    className="text-forest-600 dark:text-forest-400 hover:underline text-sm font-medium"
                  >
                    {dept.email}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="mt-20">
          <Card className="luxury-shadow">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('contact.findUs')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">{t('contact.mapPlaceholder')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    {t('contact.addressValue')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
