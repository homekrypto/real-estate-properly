import { useState } from "react";
import { useLocation } from "wouter";

export default function SimpleSignUp() {
  const [, setLocation] = useLocation();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setStatus("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus("Passwords don't match");
      return;
    }

    if (formData.password.length < 8) {
      setStatus("Password must be at least 8 characters");
      return;
    }

    if (!formData.agreeToTerms) {
      setStatus("You must agree to the terms and conditions");
      return;
    }

    // Validate agent-specific fields
    if (formData.role === "agent" && (!formData.agencyName || !formData.phone)) {
      setStatus("Agency name and phone are required for agents");
      return;
    }

    try {
      console.log("Submitting registration data:", formData);
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("Registration successful:", data);
        setStatus("Registration successful! Redirecting to verification...");
        setTimeout(() => {
          setLocation("/verify-email?email=" + encodeURIComponent(formData.email));
        }, 1000);
      } else {
        setStatus("Registration failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      setStatus("Registration failed: Network error");
    }
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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Create Your Account</h1>
      <p>Join the Properly real estate platform</p>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* User Type Selection */}
        <div>
          <label htmlFor="role">Account Type:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="seeker">Property Seeker</option>
            <option value="agent">Real Estate Agent</option>
            <option value="developer">Property Developer</option>
          </select>
        </div>

        {/* Name Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label htmlFor="firstName">First Name *</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name *</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>

        {/* Password Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              required
            />
          </div>
        </div>

        {/* Agent-specific fields */}
        {formData.role === "agent" && (
          <div style={{ backgroundColor: "#f0f8ff", padding: "15px", borderRadius: "5px" }}>
            <h3>Agent Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
              <div>
                <label htmlFor="agencyName">Agency Name *</label>
                <input
                  id="agencyName"
                  name="agencyName"
                  type="text"
                  value={formData.agencyName}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
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
          />
          <label htmlFor="agreeToTerms">
            I agree to the Terms and Conditions and Privacy Policy
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          style={{ 
            padding: "12px", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Create Account
        </button>
      </form>

      {/* Status Message */}
      {status && (
        <div style={{ 
          marginTop: "15px", 
          padding: "10px", 
          backgroundColor: status.includes("successful") ? "#d4edda" : "#f8d7da",
          border: "1px solid " + (status.includes("successful") ? "#c3e6cb" : "#f5c6cb"),
          borderRadius: "5px"
        }}>
          {status}
        </div>
      )}

      {/* Login Link */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}