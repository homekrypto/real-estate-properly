import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { Suspense } from "react";

import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Search from "@/pages/search";
import SearchResults from "@/pages/search-results";
import PropertyDetail from "@/pages/property-detail";
import Agents from "@/pages/agents";
import Pricing from "@/pages/pricing";
import Blog from "@/pages/blog";
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
      <h1 style={{color: 'red', textAlign: 'center'}}>Hello World - React is Rendering</h1>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/search" component={Search} />
        <Route path="/search-results" component={SearchResults} />
        <Route path="/property/:id" component={PropertyDetail} />
        <Route path="/agents" component={Agents} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/blog" component={Blog} />
        <Route path="/developer" component={Developer} />
        <Route path="/signup" component={SignUpNew} />
        <Route path="/login" component={LoginNew} />
        <Route path="/verify-email" component={VerifyEmailNew} />
        <Route path="/agent-pricing" component={AgentPricing} />
        <Route component={NotFound} />
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
