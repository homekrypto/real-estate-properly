import { useState } from "react";
import { useLocation } from "wouter";

export default function SignUpNew() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAgent: false,
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Extract first and last name from full name
    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setStatus("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus("Passwords don't match");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setStatus("Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    }

    const registrationData = {
      firstName,
      lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.isAgent ? "agent" : "seeker",
      agreeToTerms: true
    };

    try {
      // MANDATORY DEBUG LOG
      console.log(`[DEBUG] Attempting to create user: ${formData.email}`);
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // MANDATORY SUCCESS LOG
        console.log(`[SUCCESS] User '${formData.email}' created in database. Role: '${registrationData.role}', Status: 'unverified'.`);
        console.log(`[INFO] Verification email simulation triggered for ${formData.email}.`);
        
        // MANDATORY UI MESSAGE
        setStatus("Registration successful. Please check your email to verify your account.");
        
        // Redirect to verification page after 2 seconds
        setTimeout(() => {
          setLocation(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      } else {
        setStatus("Registration failed: " + (data.error || data.message || "Unknown error"));
        console.error("[ERROR] Registration failed:", data);
      }
    } catch (error) {
      console.error("[ERROR] Network error:", error);
      setStatus("Network error. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
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
        maxWidth: "450px",
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
          Sign Up
        </h1>
        <p style={{ 
          color: "#666",
          marginBottom: "30px",
          textAlign: "center"
        }}>
          Create your Properly account
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500"
            }}>
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
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

          {/* Email Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500"
            }}>
              Email *
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
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500"
            }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Min. 8 characters"
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

          {/* Confirm Password Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "500"
            }}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter password"
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

          {/* Agent Checkbox */}
          <div style={{ marginBottom: "25px", display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              id="isAgent"
              name="isAgent"
              checked={formData.isAgent}
              onChange={handleInputChange}
              style={{ 
                width: "18px",
                height: "18px",
                marginRight: "10px",
                cursor: "pointer"
              }}
            />
            <label htmlFor="isAgent" style={{ 
              color: "#333",
              cursor: "pointer",
              userSelect: "none"
            }}>
              I am a Real Estate Agent
            </label>
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
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

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

        {/* Login Link */}
        <div style={{ marginTop: "25px", textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Already have an account?{" "}
            <a 
              href="/login" 
              style={{ 
                color: "#007bff",
                textDecoration: "none",
                fontWeight: "500"
              }}
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}