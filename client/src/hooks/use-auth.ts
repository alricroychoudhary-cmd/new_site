import { useMutation } from "@tanstack/react-query";
import { api, type LoginInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useLogin() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      // Validate runtime before sending (defensive)
      const validated = api.auth.login.input.parse(data);
      
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400 || res.status === 401) {
          const error = await res.json();
          throw new Error(error.message || "Invalid credentials");
        }
        throw new Error("Login failed");
      }

      return api.auth.login.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    }
  });
}
