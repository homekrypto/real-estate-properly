import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function VerifyEmailNew() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get email and token from URL params
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const tokenParam = params.get("token");
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (tokenParam) {
      setToken(tokenParam);
      // Auto-verify if token is present
      handleVerification(tokenParam);
    }
  }, []);

  const handleVerification = async (verificationToken: string) => {
    try {
      // MANDATORY DEBUG LOG
      console.log("[DEBUG] Verification token received. Looking up user.");
      
      const response = await fetch(`/api/auth/verify-email/${verificationToken}`, {
        method: "GET",
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // MANDATORY SUCCESS LOG
        console.log(`[SUCCESS] User '${data.email || email}' status updated to 'verified'.`);
        
        setStatus("success");
        // MANDATORY UI MESSAGE
        setMessage("Account verified. You may now log in.");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          setLocation("/login");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(data.error || "Verification failed. Invalid or expired token.");
        console.error("[ERROR] Verification failed:", data);
      }
    } catch (error) {
      console.error("[ERROR] Network error during verification:", error);
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  const simulateVerification = () => {
    // Simulate clicking the verification link
    const simulatedToken = "simulated-token-" + Date.now();
    handleVerification(simulatedToken);
  };

  const resendVerification = async () => {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("Verification email sent. Please check your inbox.");
        console.log(`[INFO] Verification email resent to ${email}.`);
      } else {
        setMessage(data.error || "Failed to resend verification email.");
      }
    } catch (error) {
      console.error("[ERROR] Failed to resend verification:", error);
      setMessage("Network error. Please try again.");
    }
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
        padding: "40px",
        textAlign: "center"
      }}>
        {/* Icon */}
        <div style={{ 
          width: "80px",
          height: "80px",
          margin: "0 auto 20px",
          borderRadius: "50%",
          backgroundColor: status === "success" ? "#28a745" : status === "error" ? "#dc3545" : "#007bff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "36px"
        }}>
          {status === "success" ? "✓" : status === "error" ? "✗" : "✉"}
        </div>

        {/* Title */}
        <h1 style={{ 
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#333"
        }}>
          {status === "success" 
            ? "Email Verified!"
            : status === "error"
            ? "Verification Failed"
            : "Verify Your Email"
          }
        </h1>

        {/* Message */}
        <p style={{ 
          color: "#666",
          marginBottom: "30px",
          fontSize: "16px",
          lineHeight: "1.5"
        }}>
          {message || "We've sent a verification link to your email address. Please check your inbox."}
        </p>

        {/* Email display */}
        {email && status === "pending" && (
          <div style={{ 
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "6px",
            marginBottom: "20px"
          }}>
            <p style={{ color: "#333", margin: 0 }}>
              Sent to: <strong>{email}</strong>
            </p>
          </div>
        )}

        {/* Actions based on status */}
        {status === "pending" && (
          <>
            {/* Simulate verification button (for testing) */}
            <button 
              onClick={simulateVerification}
              style={{ 
                width: "100%",
                padding: "12px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
              Simulate Email Verification (Test)
            </button>

            {/* Resend button */}
            <button 
              onClick={resendVerification}
              style={{ 
                width: "100%",
                padding: "12px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Resend Verification Email
            </button>
          </>
        )}

        {status === "success" && (
          <button 
            onClick={() => setLocation("/login")}
            style={{ 
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            Go to Login
          </button>
        )}

        {status === "error" && (
          <>
            <button 
              onClick={resendVerification}
              style={{ 
                width: "100%",
                padding: "12px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
              Resend Verification Email
            </button>
            <button 
              onClick={() => setLocation("/signup")}
              style={{ 
                width: "100%",
                padding: "12px",
                backgroundColor: "transparent",
                color: "#007bff",
                border: "1px solid #007bff",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Back to Sign Up
            </button>
          </>
        )}

        {/* Help text */}
        <div style={{ marginTop: "30px" }}>
          <p style={{ color: "#999", fontSize: "14px" }}>
            Didn't receive the email? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}