import { useState } from "react";

export default function TestSignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "seeker",
    agencyName: "",
    phone: "",
    agreeToTerms: false
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Submitting registration...");
    
    console.log("=== SIGNUP DEBUG START ===");
    console.log("Form data:", formData);
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setStatus("Error: Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus("Error: Passwords don't match");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setStatus("Error: Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setStatus("Error: You must agree to the terms and conditions");
      setIsSubmitting(false);
      return;
    }

    // Validate agent-specific fields
    if (formData.role === "agent" && (!formData.agencyName || !formData.phone)) {
      setStatus("Error: Agency name and phone are required for agents");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Making API request to /api/auth/register");
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      if (response.ok) {
        setStatus("SUCCESS: Registration completed! Check your email for verification.");
        console.log("=== REGISTRATION SUCCESSFUL ===");
      } else {
        setStatus("ERROR: " + (data.error || data.message || "Unknown error"));
        console.log("=== REGISTRATION FAILED ===");
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatus("ERROR: Network error - " + error.message);
    }
    
    setIsSubmitting(false);
    console.log("=== SIGNUP DEBUG END ===");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "600px", 
      margin: "20px auto", 
      fontFamily: "Arial, sans-serif",
      backgroundColor: "white",
      border: "1px solid #ddd",
      borderRadius: "8px"
    }}>
      <h1 style={{ color: "#333", marginBottom: "10px" }}>Create Your Account</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>Join the Properly real estate platform</p>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* User Type Selection */}
        <div>
          <label htmlFor="role" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Account Type:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            style={{ 
              width: "100%", 
              padding: "10px", 
              border: "1px solid #ccc", 
              borderRadius: "4px",
              fontSize: "14px"
            }}
          >
            <option value="seeker">Property Seeker</option>
            <option value="agent">Real Estate Agent</option>
            <option value="developer">Property Developer</option>
          </select>
        </div>

        {/* Name Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div>
            <label htmlFor="firstName" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>First Name *</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              style={{ 
                width: "100%", 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "4px",
                fontSize: "14px"
              }}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Last Name *</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              style={{ 
                width: "100%", 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "4px",
                fontSize: "14px"
              }}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ 
              width: "100%", 
              padding: "10px", 
              border: "1px solid #ccc", 
              borderRadius: "4px",
              fontSize: "14px"
            }}
            required
          />
        </div>

        {/* Password Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div>
            <label htmlFor="password" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{ 
                width: "100%", 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "4px",
                fontSize: "14px"
              }}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Confirm Password *</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={{ 
                width: "100%", 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "4px",
                fontSize: "14px"
              }}
              required
            />
          </div>
        </div>

        {/* Agent-specific fields */}
        {formData.role === "agent" && (
          <div style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "15px", 
            borderRadius: "8px",
            border: "1px solid #e9ecef"
          }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#495057" }}>Agent Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label htmlFor="agencyName" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Agency Name *</label>
                <input
                  id="agencyName"
                  name="agencyName"
                  type="text"
                  value={formData.agencyName}
                  onChange={handleInputChange}
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    border: "1px solid #ccc", 
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    border: "1px solid #ccc", 
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            style={{ width: "16px", height: "16px" }}
          />
          <label htmlFor="agreeToTerms" style={{ fontSize: "14px" }}>
            I agree to the Terms and Conditions and Privacy Policy
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: "15px", 
            backgroundColor: isSubmitting ? "#6c757d" : "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "6px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Status Message */}
      {status && (
        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: status.includes("SUCCESS") ? "#d4edda" : status.includes("ERROR") ? "#f8d7da" : "#fff3cd",
          border: "1px solid " + (status.includes("SUCCESS") ? "#c3e6cb" : status.includes("ERROR") ? "#f5c6cb" : "#ffeaa7"),
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "bold"
        }}>
          {status}
        </div>
      )}

      {/* Login Link */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}