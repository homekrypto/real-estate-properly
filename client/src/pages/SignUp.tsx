import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, User, Hammer, Mail, Lock, UserPlus, Phone, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "seeker" | "agent" | "developer";
  // Agent-specific fields
  agencyName?: string;
  phone?: string;
  agreeToTerms: boolean;
}

export default function SignUp() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "seeker",
    agreeToTerms: false
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error(t('auth.passwordMismatch'));
      }
      
      // Validate required fields for agents
      if (data.role === "agent" && (!data.agencyName || !data.phone)) {
        throw new Error(t('auth.fillRequired'));
      }

      if (!data.agreeToTerms) {
        throw new Error(t('auth.mustAgreeToTerms'));
      }

      return apiRequest("/api/auth/register", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: t('auth.registerSuccess'),
        description: t('auth.verificationEmailSent'),
      });
      setLocation("/verify-email?email=" + encodeURIComponent(formData.email));
    },
    onError: (error: Error) => {
      toast({
        title: t('auth.registerError'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: t('common.error'),
        description: t('auth.fillRequired'),
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: t('common.error'),
        description: t('auth.passwordTooShort'),
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as "seeker" | "agent" | "developer",
      // Reset agent-specific fields when changing roles
      agencyName: "",
      phone: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('auth.createAccount')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t('auth.joinPlatform')}
          </p>
        </div>

        <Tabs value={formData.role} onValueChange={handleRoleChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="seeker" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('auth.seeker')}
            </TabsTrigger>
            <TabsTrigger value="agent" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              {t('auth.agent')}
            </TabsTrigger>
            <TabsTrigger value="developer" className="flex items-center gap-2">
              <Hammer className="h-4 w-4" />
              {t('auth.developer')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seeker">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  {t('auth.propertySeeker')}
                </CardTitle>
                <CardDescription>
                  {t('auth.seekerDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agreeToTerms: checked as boolean })
                      }
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      {t('auth.agreeToTerms')}
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? t('auth.creating') : t('auth.createAccount')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agent">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-600" />
                  {t('auth.realEstateAgent')}
                </CardTitle>
                <CardDescription>
                  {t('auth.agentDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="agencyName">{t('auth.agencyName')}</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="agencyName"
                        name="agencyName"
                        type="text"
                        className="pl-10"
                        value={formData.agencyName || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">{t('auth.phoneNumber')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="pl-10"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agreeToTerms: checked as boolean })
                      }
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      {t('auth.agreeToTerms')}
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? t('auth.creating') : t('auth.createAgentAccount')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="developer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hammer className="h-5 w-5 text-orange-600" />
                  {t('auth.propertyDeveloper')}
                </CardTitle>
                <CardDescription>
                  {t('auth.developerDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="agencyName">{t('auth.companyName')}</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="agencyName"
                        name="agencyName"
                        type="text"
                        className="pl-10"
                        value={formData.agencyName || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">{t('auth.phoneNumber')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="pl-10"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agreeToTerms: checked as boolean })
                      }
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      {t('auth.agreeToTerms')}
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? t('auth.creating') : t('auth.createDeveloperAccount')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('auth.alreadyHaveAccount')}{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}