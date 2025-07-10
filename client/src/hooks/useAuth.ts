import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: false, // Disable auth checks to allow public access
  });

  return {
    user,
    isLoading: false, // Override loading state
    isAuthenticated: false, // Always show public routes for now
  };
}
