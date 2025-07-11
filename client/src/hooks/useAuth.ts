import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/user");
      if (!res.ok) return null;
      return await res.json();
    },
    retry: false,
    enabled: true, // Enable auth checks
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
