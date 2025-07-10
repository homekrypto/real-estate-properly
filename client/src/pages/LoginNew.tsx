import { useState } from "react";
import { useLocation } from "wouter";

export default function LoginNew() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setStatus("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // MANDATORY SUCCESS LOG
        console.log(`[SUCCESS] Authentication successful for '${formData.email}'. Session initiated.`);
        
        setStatus("Login successful! Redirecting...");
        
        // Store user data in session/local storage (in a real app, this would be handled by proper auth)
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect based on user role and subscription status
        setTimeout(() => {
          if (data.redirectUrl) {
            setLocation(data.redirectUrl);
          } else {
            setLocation("/");
          }
        }, 1000);
      } else {
        setStatus(data.error || "Login failed");
        console.error("[ERROR] Login failed:", data);
      }
    } catch (error) {
      console.error("[ERROR] Network error:", error);
      setStatus("Network error. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      padding: "20px"
    }}>
      <div style={{ 
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        padding: "40px"
      }}>
        <h1 style={{ 
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#333",
          textAlign: "center"
        }}>
          Welcome Back
        </h1>
        <p style={{ 
          color: "#666",
          marginBottom: "30px",
          textAlign: "center"
        }}>
          Sign in to your account
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500"
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
              style={{ 
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              required
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500"
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              style={{ 
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              width: "100%",
              padding: "14px",
              backgroundColor: isSubmitting ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Test Credentials Info */}
        <div style={{ 
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
          fontSize: "14px",
          color: "#666"
        }}>
          <strong>Test Credentials:</strong><br />
          Property Seeker: seeker@example.com<br />
          Real Estate Agent: agent@example.com<br />
          <small>(Use any password for testing)</small>
        </div>

        {/* Status Message */}
        {status && (
          <div style={{ 
            marginTop: "20px",
            padding: "12px",
            backgroundColor: status.includes("successful") ? "#d4edda" : "#f8d7da",
            color: status.includes("successful") ? "#155724" : "#721c24",
            border: `1px solid ${status.includes("successful") ? "#c3e6cb" : "#f5c6cb"}`,
            borderRadius: "6px",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {status}
          </div>
        )}

        {/* Links */}
        <div style={{ marginTop: "25px", textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "10px" }}>
            Don't have an account?{" "}
            <a 
              href="/signup" 
              style={{ 
                color: "#007bff",
                textDecoration: "none",
                fontWeight: "500"
              }}
            >
              Sign up
            </a>
          </p>
          <p style={{ color: "#666", fontSize: "14px" }}>
            <a 
              href="/forgot-password" 
              style={{ 
                color: "#007bff",
                textDecoration: "none"
              }}
            >
              Forgot password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}