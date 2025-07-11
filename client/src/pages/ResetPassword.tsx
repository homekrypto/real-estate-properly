import { useState } from "react";
import { useLocation } from "wouter";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    token: ""
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!formData.password || !formData.confirmPassword || !formData.token) {
      setStatus("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setStatus("Passwords do not match");
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus("Password reset successful! You can now log in.");
        setTimeout(() => setLocation("/login"), 1500);
      } else {
        setStatus(data.error || "Failed to reset password");
      }
    } catch (error) {
      setStatus("Network error. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <input
        type="text"
        placeholder="Reset Token"
        value={formData.token}
        onChange={e => setFormData({ ...formData, token: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={formData.confirmPassword}
        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded" disabled={isSubmitting}>
        {isSubmitting ? "Resetting..." : "Reset Password"}
      </button>
      {status && <p className="mt-4 text-red-600">{status}</p>}
    </form>
  );
}
