import { useState } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';
import { Crown, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return apiRequest("/api/auth/login", "POST", data);
    },
    onSuccess: (response) => {
      toast({
        title: t('auth.loginSuccess'),
        description: t('auth.welcomeBack'),
      });
      // Redirect based on user type and subscription status
      const redirectUrl = response.redirectUrl || "/";
      setLocation(redirectUrl);
    },
    onError: (error: Error) => {
      toast({
        title: t('auth.loginError'),
        description: error.message || t('auth.invalidCredentials'),
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-forest-600 to-gold-500 rounded-2xl flex items-center justify-center mb-6">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="font-luxury text-3xl font-bold text-gray-900 dark:text-white">
              {t('auth.welcomeBack')}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('auth.loginDescription')}
            </p>
          </div>

          {/* Login Form */}
          <Card className="bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                {t('auth.signInToAccount')}
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                {t('auth.enterCredentials')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.email')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder={t('auth.emailPlaceholder')}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.password')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder={t('auth.passwordPlaceholder')}
                              className="h-12 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              {t('auth.rememberMe')}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 font-normal text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300"
                      onClick={() => setLocation('/forgot-password')}
                    >
                      {t('auth.forgotPassword')}
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? t('auth.signingIn') : t('auth.login')}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('auth.noAccount')}{' '}
                </span>
                <Button
                  variant="link"
                  className="px-0 font-semibold text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300"
                  onClick={() => setLocation('/signup')}
                >
                  {t('auth.signUp')}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}