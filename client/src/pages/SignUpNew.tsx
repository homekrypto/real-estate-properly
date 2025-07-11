import { useState } from "react";
import { useLocation } from "wouter";

export default function SignUpNew() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAgent: false,
    phone: "",
    referral: "",
    agreeToTerms: false,
    agencyName: "",
    country: "",
    region: "",
    city: "",
    licenseNumber: "",
    profileImage: null as File | null,
    agencyLogo: null as File | null,
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [status, setStatus] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
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
    if (!formData.agreeToTerms) {
      setStatus("You must accept the Terms & Conditions");
      setIsSubmitting(false);
      return;
    }
    if (emailExists) {
      setStatus("Email already exists");
      setIsSubmitting(false);
      return;
    }
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.isAgent ? "agent" : "seeker",
      agreeToTerms: formData.agreeToTerms,
      phone: formData.phone,
      referral: formData.referral,
      agencyName: formData.isAgent ? formData.agencyName : undefined,
      country: formData.isAgent ? formData.country : undefined,
      // region removed, now using city
      licenseNumber: formData.isAgent ? formData.licenseNumber : undefined,
      profileImage: formData.isAgent ? formData.profileImage : undefined,
    };
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus("Registration successful. Please check your email to verify your account.");
        setTimeout(() => {
          setLocation(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      } else {
        setStatus("Registration failed: " + (data.error || data.message || "Unknown error"));
      }
    } catch (error) {
      setStatus("Network error. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-8">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white">Create Account</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Sign up to get started</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Name</label>
            <input
              type="text"
              name="firstName"
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Surname</label>
            <input
              type="text"
              name="lastName"
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Email *</label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              className={`w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white ${emailExists ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={async e => {
                setFormData({ ...formData, email: e.target.value });
                setCheckingEmail(true);
                // Instant email validation (simulate API call)
                const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(e.target.value)}`);
                const data = await res.json();
                setEmailExists(data.exists);
                setCheckingEmail(false);
              }}
              required
            />
            {checkingEmail && <span className="text-xs text-gray-500">Checking email...</span>}
            {emailExists && <span className="text-xs text-red-500">Email already exists</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="off"
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                value={formData.password}
                onChange={e => {
                  setFormData({ ...formData, password: e.target.value });
                  // Password strength meter
                  const val = e.target.value;
                  let score = 0;
                  if (val.length >= 8) score++;
                  if (/[A-Z]/.test(val)) score++;
                  if (/[0-9]/.test(val)) score++;
                  if (/[^A-Za-z0-9]/.test(val)) score++;
                  setPasswordStrength(score);
                }}
                required
              />
              <button type="button" className="absolute right-2 top-2 text-xs text-gray-500" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="mt-2">
              <div className="w-full h-2 bg-gray-200 rounded">
                <div className={`h-2 rounded ${passwordStrength === 0 ? 'bg-red-400 w-1/4' : passwordStrength === 1 ? 'bg-orange-400 w-1/3' : passwordStrength === 2 ? 'bg-yellow-400 w-2/3' : passwordStrength === 3 ? 'bg-green-400 w-3/4' : 'bg-green-600 w-full'}`}></div>
              </div>
              <span className="text-xs text-gray-500">{passwordStrength === 0 ? "Too weak" : passwordStrength === 1 ? "Weak" : passwordStrength === 2 ? "Medium" : passwordStrength === 3 ? "Strong" : "Very strong"}</span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                autoComplete="off"
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <button type="button" className="absolute right-2 top-2 text-xs text-gray-500" onClick={() => setShowConfirmPassword(v => !v)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Phone (optional)</label>
            <input
              type="tel"
              name="phone"
              autoComplete="off"
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Referral Code (optional)</label>
            <input
              type="text"
              name="referral"
              autoComplete="off"
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              value={formData.referral}
              onChange={e => setFormData({ ...formData, referral: e.target.value })}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isAgent"
              name="isAgent"
              checked={formData.isAgent}
              onChange={e => setFormData({ ...formData, isAgent: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isAgent" className="text-gray-700 dark:text-gray-300 cursor-pointer select-none">I am a Real Estate Agent</label>
          </div>
          {formData.isAgent && (
            <>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Agency Name</label>
                <input
                  type="text"
                  name="agencyName"
                  autoComplete="off"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  value={formData.agencyName}
                  onChange={e => {
                    setFormData({ ...formData, agencyName: e.target.value });
                    setFieldErrors({ ...fieldErrors, agencyName: e.target.value ? "" : "Agency Name is required" });
                  }}
                  required={formData.isAgent}
                />
                {fieldErrors.agencyName && <p className="text-red-500 text-xs mt-1">{fieldErrors.agencyName}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Country</label>
                <select
                  name="country"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  value={formData.country}
                  onChange={e => {
                    setFormData({ ...formData, country: e.target.value, region: "" });
                    setFieldErrors({ ...fieldErrors, country: e.target.value ? "" : "Country is required" });
                  }}
                  required={formData.isAgent}
                >
                  <option value="">Select Country</option>
                  <option value="PL">Poland</option>
                  <option value="ES">Spain</option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  {/* ...existing code... */}
                </select>
                {fieldErrors.country && <p className="text-red-500 text-xs mt-1">{fieldErrors.country}</p>}
              </div>
              {/* Region dropdown for selected countries */}
              {['PL', 'ES', 'GB', 'US', 'CA', 'AU'].includes(formData.country) && (
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Region/State</label>
                  <select
                    name="region"
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                    value={formData.region}
                    onChange={e => {
                      setFormData({ ...formData, region: e.target.value });
                      setFieldErrors({ ...fieldErrors, region: e.target.value ? "" : "Region/State is required" });
                    }}
                    required={formData.isAgent}
                  >
                    <option value="">Select Region/State</option>
                    {/* Example regions for Poland, Spain, UK, US, CA, AU */}
                    {formData.country === 'PL' && <>
                      <option value="Mazowieckie">Mazowieckie</option>
                      <option value="Malopolskie">Małopolskie</option>
                      <option value="Slaskie">Śląskie</option>
                      <option value="Dolnoslaskie">Dolnośląskie</option>
                      <option value="Pomorskie">Pomorskie</option>
                      {/* ...add all Polish regions... */}
                    </>}
                    {formData.country === 'ES' && <>
                      <option value="Madrid">Madrid</option>
                      <option value="Catalonia">Catalonia</option>
                      <option value="Andalusia">Andalusia</option>
                      {/* ...add all Spanish regions... */}
                    </>}
                    {formData.country === 'GB' && <>
                      <option value="England">England</option>
                      <option value="Scotland">Scotland</option>
                      <option value="Wales">Wales</option>
                      <option value="Northern Ireland">Northern Ireland</option>
                    </>}
                    {formData.country === 'US' && <>
                      <option value="California">California</option>
                      <option value="Texas">Texas</option>
                      <option value="New York">New York</option>
                      {/* ...add all US states... */}
                    </>}
                    {formData.country === 'CA' && <>
                      <option value="Ontario">Ontario</option>
                      <option value="Quebec">Quebec</option>
                      <option value="British Columbia">British Columbia</option>
                      {/* ...add all Canadian provinces... */}
                    </>}
                    {formData.country === 'AU' && <>
                      <option value="New South Wales">New South Wales</option>
                      <option value="Victoria">Victoria</option>
                      <option value="Queensland">Queensland</option>
                      {/* ...add all Australian states... */}
                    </>}
                  </select>
                  {fieldErrors.region && <p className="text-red-500 text-xs mt-1">{fieldErrors.region}</p>}
                </div>
              )}
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  autoComplete="off"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  value={formData.city || ""}
                  onChange={e => {
                    setFormData({ ...formData, city: e.target.value });
                    setFieldErrors({ ...fieldErrors, city: e.target.value ? "" : "City is required" });
                  }}
                  required={formData.isAgent}
                />
                {fieldErrors.city && <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">License Number {formData.country === 'PL' ? '(required)' : '(optional)'}</label>
                <input
                  type="text"
                  name="licenseNumber"
                  autoComplete="off"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  value={formData.licenseNumber}
                  onChange={e => {
                    setFormData({ ...formData, licenseNumber: e.target.value });
                    setFieldErrors({ ...fieldErrors, licenseNumber: (formData.country === 'PL' && !e.target.value) ? "License Number is required for Poland" : "" });
                  }}
                  required={formData.country === 'PL'}
                />
                {fieldErrors.licenseNumber && <p className="text-red-500 text-xs mt-1">{fieldErrors.licenseNumber}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Profile Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setFormData({ ...formData, profileImage: file });
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setProfilePreview(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setProfilePreview(null);
                    }
                  }}
                />
                {profilePreview && (
                  <img src={profilePreview} alt="Profile Preview" className="mt-2 w-24 h-24 object-cover rounded-full border" />
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">Agency Logo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setFormData({ ...formData, agencyLogo: file });
                  }}
                />
                {formData.agencyLogo && (
                  <img src={URL.createObjectURL(formData.agencyLogo)} alt="Agency Logo Preview" className="mt-2 w-24 h-24 object-cover rounded border" />
                )}
              </div>
            </>
          )}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={e => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              className="mr-2"
              required
            />
            <label htmlFor="agreeToTerms" className="text-gray-700 dark:text-gray-300 cursor-pointer select-none">I accept the <a href="/terms" className="underline">Terms & Conditions</a></label>
          </div>
          <div className="mb-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-center text-xs text-gray-600 dark:text-gray-300">
              Google reCAPTCHA placeholder (add real CAPTCHA here)
            </div>
          </div>
          <div className="mb-4 flex flex-col gap-2">
            <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.92h5.23c-.22 1.13-1.32 3.32-5.23 3.32-3.15 0-5.73-2.61-5.73-5.83s2.58-5.83 5.73-5.83c1.8 0 3.01.77 3.7 1.43l2.53-2.46C16.13 3.99 14.36 3 12.18 3 6.7 3 2.5 7.13 2.5 12s4.2 9 9.68 9c5.59 0 9.32-3.93 9.32-9.48 0-.64-.07-1.13-.15-1.62z"/></svg>
              Sign up with Google
            </button>
            <button type="button" className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded font-bold flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.849-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667h-3.554V9h3.414v1.561h.049c.476-.9 1.637-1.849 3.37-1.849 3.602 0 4.267 2.369 4.267 5.455v6.285z"/></svg>
              Sign up with LinkedIn
            </button>
          </div>
          <button type="submit" className="w-full bg-forest-600 hover:bg-forest-700 text-white py-2 rounded font-bold" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Sign Up"}
          </button>
          <div className="mt-4 text-center">
            <a href="/login" className="text-forest-600 underline">Already have an account? Log in</a>
          </div>
          {status && <p className="mt-4 text-red-600 text-center">{status}</p>}
        </form>
      </div>
    </div>
  );
}