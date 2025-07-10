import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Crown, ArrowRight, User, Building, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Link, useLocation } from 'wouter';

export default function Register() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('buyer');
  
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    userType: 'buyer',
    language: 'en',
    agreeToTerms: false,
    agreeToMarketing: false,
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      return response.json();
    },
    onSuccess: (user) => {
      toast({
        title: t('auth.registrationSuccess'),
        description: t('auth.welcomeMessage', { name: user.firstName }),
      });
      // Redirect based on user type
      if (user.userType === 'agent') {
        setLocation('/agent-dashboard');
      } else if (user.userType === 'developer') {
        setLocation('/developer-dashboard');
      } else {
        setLocation('/dashboard');
      }
    },
    onError: (error) => {
      toast({
        title: t('auth.registrationError'),
        description: error.message || t('auth.registrationFailed'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password) {
      toast({
        title: t('common.error'),
        description: t('auth.fillRequired'),
        variant: 'destructive',
      });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: t('common.error'),
        description: t('auth.passwordsNotMatch'),
        variant: 'destructive',
      });
      return;
    }

    if (registerForm.password.length < 8) {
      toast({
        title: t('common.error'),
        description: t('auth.passwordTooShort'),
        variant: 'destructive',
      });
      return;
    }

    if (!registerForm.agreeToTerms) {
      toast({
        title: t('common.error'),
        description: t('auth.mustAgreeToTerms'),
        variant: 'destructive',
      });
      return;
    }

    const { confirmPassword, ...userData } = registerForm;
    registerMutation.mutate(userData);
  };

  const userTypes = [
    {
      id: 'buyer',
      title: t('auth.userTypes.buyer.title'),
      description: t('auth.userTypes.buyer.description'),
      icon: <User className="h-6 w-6" />,
    },
    {
      id: 'agent',
      title: t('auth.userTypes.agent.title'),
      description: t('auth.userTypes.agent.description'),
      icon: <Building className="h-6 w-6" />,
    },
    {
      id: 'developer',
      title: t('auth.userTypes.developer.title'),
      description: t('auth.userTypes.developer.description'),
      icon: <Home className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-16 h-16 luxury-gradient rounded-2xl flex items-center justify-center">
              <Crown className="h-8 w-8 text-gold-400" />
            </div>
            <span className="font-luxury text-4xl font-bold text-forest-800 dark:text-forest-300">
              Properly
            </span>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-luxury text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('auth.joinProperly')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('auth.registerDescription')}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              t('auth.benefits.globalNetwork'),
              t('auth.benefits.exclusiveListings'),
              t('auth.benefits.expertSupport'),
              t('auth.benefits.advancedTools'),
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-forest-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Hidden on mobile */}
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
              alt="Real estate professionals"
              className="rounded-2xl luxury-shadow w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="luxury-shadow border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('auth.createAccount')}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                {t('auth.getStartedToday')}
              </p>
            </CardHeader>
            <CardContent>
              {/* User Type Selection */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="buyer" className="text-xs">
                    {t('auth.buyer')}
                  </TabsTrigger>
                  <TabsTrigger value="agent" className="text-xs">
                    {t('auth.agent')}
                  </TabsTrigger>
                  <TabsTrigger value="developer" className="text-xs">
                    {t('auth.developer')}
                  </TabsTrigger>
                </TabsList>
                
                {userTypes.map((type) => (
                  <TabsContent key={type.id} value={type.id} className="mt-4">
                    <Card className="border-forest-200 dark:border-forest-700">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-forest-100 dark:bg-forest-900 rounded-lg flex items-center justify-center">
                            {type.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {type.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      {t('auth.firstName')}
                    </label>
                    <Input
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm(prev => ({ 
                        ...prev, 
                        firstName: e.target.value,
                        userType: activeTab 
                      }))}
                      placeholder={t('auth.firstNamePlaceholder')}
                      className="luxury-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      {t('auth.lastName')}
                    </label>
                    <Input
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder={t('auth.lastNamePlaceholder')}
                      className="luxury-input"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    {t('auth.email')}
                  </label>
                  <Input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={t('auth.emailPlaceholder')}
                    className="luxury-input"
                    required
                  />
                </div>

                {/* Phone and Company (for professionals) */}
                {(activeTab === 'agent' || activeTab === 'developer') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        {t('auth.phone')}
                      </label>
                      <Input
                        type="tel"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder={t('auth.phonePlaceholder')}
                        className="luxury-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        {t('auth.company')}
                      </label>
                      <Input
                        value={registerForm.company}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, company: e.target.value }))}
                        placeholder={t('auth.companyPlaceholder')}
                        className="luxury-input"
                      />
                    </div>
                  </div>
                )}

                {/* Password Fields */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder={t('auth.passwordPlaceholder')}
                      className="luxury-input pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    {t('auth.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      className="luxury-input pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    {t('auth.language')}
                  </label>
                  <Select 
                    value={registerForm.language} 
                    onValueChange={(value) => setRegisterForm(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="luxury-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="pl">🇵🇱 Polski</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={registerForm.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setRegisterForm(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                      }
                      className="mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                      {t('auth.agreeToTerms')}{' '}
                      <Link href="/terms">
                        <span className="text-forest-600 dark:text-forest-400 hover:underline">
                          {t('auth.termsOfService')}
                        </span>
                      </Link>
                      {' '}{t('auth.and')}{' '}
                      <Link href="/privacy">
                        <span className="text-forest-600 dark:text-forest-400 hover:underline">
                          {t('auth.privacyPolicy')}
                        </span>
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={registerForm.agreeToMarketing}
                      onCheckedChange={(checked) => 
                        setRegisterForm(prev => ({ ...prev, agreeToMarketing: checked as boolean }))
                      }
                      className="mt-0.5"
                    />
                    <label htmlFor="marketing" className="text-sm text-gray-600 dark:text-gray-300">
                      {t('auth.marketingConsent')}
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full luxury-button"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    t('auth.creatingAccount')
                  ) : (
                    <>
                      {t('auth.createAccount')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    {t('auth.alreadyHaveAccount')}{' '}
                  </span>
                  <Link href="/login">
                    <span className="text-forest-600 dark:text-forest-400 hover:underline font-medium">
                      {t('auth.signIn')}
                    </span>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
