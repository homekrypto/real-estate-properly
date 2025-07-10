import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function VerifyEmail() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Get email from URL params
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const tokenParam = params.get("token");
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (tokenParam) {
      setToken(tokenParam);
      // Auto-verify if token is present
      verifyEmailMutation.mutate(tokenParam);
    }
  }, []);

  const verifyEmailMutation = useMutation({
    mutationFn: async (verificationToken: string) => {
      return fetch(`/api/auth/verify-email/${verificationToken}`, {
        method: "GET",
      }).then(res => res.json());
    },
    onSuccess: (data) => {
      if (data.success) {
        setVerificationStatus("success");
        toast({
          title: t('auth.verificationSuccess'),
          description: data.message || t('auth.verificationSuccessMessage'),
        });
      } else {
        setVerificationStatus("error");
        toast({
          title: t('auth.verificationError'),
          description: data.error || t('auth.verificationErrorMessage'),
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      setVerificationStatus("error");
      toast({
        title: t('auth.verificationError'),
        description: error.message || t('auth.verificationErrorMessage'),
        variant: "destructive",
      });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("/api/auth/resend-verification", "POST", { email });
    },
    onSuccess: () => {
      toast({
        title: t('auth.verificationResent'),
        description: t('auth.verificationResentMessage'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleResendVerification = () => {
    if (email) {
      resendVerificationMutation.mutate(email);
    }
  };

  const handleGoToLogin = () => {
    setLocation("/login");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {verificationStatus === "success" ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : verificationStatus === "error" ? (
                <AlertCircle className="h-16 w-16 text-red-500" />
              ) : (
                <Mail className="h-16 w-16 text-blue-500" />
              )}
            </div>
            <CardTitle>
              {verificationStatus === "success" 
                ? t('auth.accountVerified')
                : verificationStatus === "error"
                ? t('auth.verificationFailed')
                : t('auth.verifyYourEmail')
              }
            </CardTitle>
            <CardDescription>
              {verificationStatus === "success" 
                ? t('auth.accountVerifiedDescription')
                : verificationStatus === "error"
                ? t('auth.verificationFailedDescription')
                : t('auth.verifyYourEmailDescription')
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {verificationStatus === "pending" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.enterEmail')}
                    disabled={!!email}
                  />
                </div>
                <Button 
                  onClick={handleResendVerification}
                  disabled={!email || resendVerificationMutation.isPending}
                  className="w-full"
                >
                  {resendVerificationMutation.isPending 
                    ? t('auth.sending') 
                    : t('auth.resendVerification')
                  }
                </Button>
              </>
            )}
            
            {verificationStatus === "success" && (
              <Button onClick={handleGoToLogin} className="w-full">
                {t('auth.goToLogin')}
              </Button>
            )}
            
            {verificationStatus === "error" && (
              <div className="space-y-2">
                <Button 
                  onClick={handleResendVerification}
                  disabled={!email || resendVerificationMutation.isPending}
                  className="w-full"
                >
                  {resendVerificationMutation.isPending 
                    ? t('auth.sending') 
                    : t('auth.resendVerification')
                  }
                </Button>
                <Button 
                  onClick={handleGoToLogin} 
                  variant="outline"
                  className="w-full"
                >
                  {t('auth.goToLogin')}
                </Button>
              </div>
            )}
            
            <div className="text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                {t('auth.backToHome')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}