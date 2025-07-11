import ForgotPassword from "@/pages/ForgotPassword";
import AgentDashboard from "@/pages/dashboard/agent-dashboard";
import Buy from "@/pages/buy";
import Rent from "@/pages/rent";
import AgentRegister from "@/pages/AgentRegister";
import ResetPassword from "@/pages/ResetPassword";
import PrivacyPolicyPage from "@/pages/privacy";
import CookiePolicyPage from "@/pages/cookies";
import LegalPage from "@/pages/legal";
import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { Suspense } from "react";

import Landing from "@/pages/landing";
import Home from "@/pages/Home";
import Search from "@/pages/search";
import SearchResults from "@/pages/search-results";
import PropertyDetail from "@/pages/property-detail";
import Agents from "@/pages/agents";
import Pricing from "@/pages/Pricing";
import Blog from "@/pages/Blog";
import Developer from "@/pages/developer";
import NotFound from "@/pages/not-found";
import SignUpNew from "@/pages/SignUpNew";
import LoginNew from "@/pages/LoginNew";
import VerifyEmailNew from "@/pages/VerifyEmailNew";
import AgentPricing from "@/pages/AgentPricing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/search" component={Search} />
        <Route path="/search-results" component={SearchResults} />
        <Route path="/property/:id" component={PropertyDetail} />
        <Route path="/agents" component={Agents} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/blog" component={Blog} />
        <Route path="/developer" component={Developer} />
        <Route path="/buy" component={Buy} />
        <Route path="/rent" component={Rent} />
        <Route path="/signup" component={SignUpNew} />
        <Route path="/login" component={LoginNew} />
        <Route path="/verify-email" component={VerifyEmailNew} />
        <Route path="/agent-pricing" component={AgentPricing} />
        <Route path="/agentregister" component={AgentRegister} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/privacy" component={PrivacyPolicyPage} />
        <Route path="/cookies" component={CookiePolicyPage} />
        <Route path="/legal" component={LegalPage} />
        <Route path="/dashboard/agent" component={AgentDashboard} />
        <Route>
          <h1 style={{color: 'blue', textAlign: 'center'}}>404 Page Not Found<br/>Did you forget to add the page to the router?</h1>
        </Route>
      </Switch>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>}>
          <Router />
        </Suspense>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
