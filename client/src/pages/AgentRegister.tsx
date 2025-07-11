
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

function getQueryParam(name: string) {
  if (typeof window === 'undefined') return null;
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const plans = [
  {
    id: "bronze_5",
    name: "Bronze",
    price: "$50/mo",
    yearly: "$540/yr (10% off)",
    description: "5 listings",
    listings: 5,
  },
  {
    id: "silver_20",
    name: "Silver",
    price: "$80/mo",
    yearly: "$864/yr (10% off)",
    description: "20 listings",
    listings: 20,
  },
  {
    id: "gold_50",
    name: "Gold",
    price: "$110/mo",
    yearly: "$1,188/yr (10% off)",
    description: "50 listings",
    listings: 50,
  },
];

export default function AgentRegister() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [form, setForm] = useState({
    email: "",
    acceptTerms: false,
    password: "",
    fullName: "",
    companyName: "",
    phone: "",
    social: "",
    address: "",
    address2: "",
    postcode: "",
    city: "",
    country: "PL",
    cardName: "",
    cardNumber: "",
    cardExp: "",
    cardCvv: "",
    discount: "",
    paymentType: "monthly", // or "yearly"
  });

  // Auto-select plan and yearly payment if redirected from /pricing
  useEffect(() => {
    const planId = getQueryParam('plan');
    if (planId) {
      const foundPlan = plans.find(p => p.id === planId);
      if (foundPlan) {
        setSelectedPlan(foundPlan);
        setForm(f => ({ ...f, paymentType: "yearly" }));
      }
    }
  }, []);

  // Step 1: Email, terms, plan info
  if (step === 1) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create your account</h2>
        <div className="mb-4 bg-gray-50 dark:bg-gray-800 dark:border dark:border-gray-700 rounded p-4">
          <label className="block mb-2 font-medium text-gray-900 dark:text-gray-200">Checkout Global subscription</label>
          <select
            className="w-full p-2 border rounded mb-2 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-900"
            value={selectedPlan.id}
            onChange={e => setSelectedPlan(plans.find(p => p.id === e.target.value) || plans[0])}
          >
            {plans.map(plan => (
              <option key={plan.id} value={plan.id} className="text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-900">{plan.name} {plan.description}</option>
            ))}
          </select>
          <div className="mt-2">
            <div className="flex gap-4">
              <label className="flex items-center p-3 border rounded cursor-pointer w-1/2 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                <input
                  type="radio"
                  name="paymentType"
                  value="monthly"
                  checked={form.paymentType === "monthly"}
                  onChange={e => setForm({ ...form, paymentType: e.target.value })}
                  className="mr-2"
                />
                <span className="text-gray-900 dark:text-gray-200">
                  <span className="font-bold">Monthly</span><br/>
                  <span className="text-sm">{selectedPlan.price} per month</span>
                </span>
              </label>
              <label className="flex items-center p-3 border rounded cursor-pointer w-1/2 bg-green-50 dark:bg-green-900 border-gray-300 dark:border-gray-700">
                <input
                  type="radio"
                  name="paymentType"
                  value="yearly"
                  checked={form.paymentType === "yearly"}
                  onChange={e => setForm({ ...form, paymentType: e.target.value })}
                  className="mr-2"
                />
                <span className="text-gray-900 dark:text-gray-200">
                  <span className="font-bold text-green-700 dark:text-green-300">Yearly <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs ml-2">10% OFF</span></span><br/>
                  <span className="text-sm">{selectedPlan.yearly} billed once per year</span>
                </span>
              </label>
            </div>
            <div className="text-xs text-green-700 dark:text-green-300 mt-2">Save 20% by paying yearly!</div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={e => setForm({ ...form, acceptTerms: e.target.checked })}
            className="mr-2"
            required
          />
          <span>By creating an account, I accept the <a href="/terms" className="underline">terms and conditions</a>.</span>
        </div>
        <div className="flex justify-between mt-6">
          <button className="luxury-button" onClick={() => setLocation("/pricing")}>Back</button>
          <button
            className="luxury-button"
            disabled={!form.email || !form.acceptTerms}
            onClick={() => setStep(2)}
          >Next</button>
        </div>
        <div className="mt-4 text-right text-sm text-gray-500">Step 1/4</div>
      </div>
    );
  }

  // Step 2: Social login or password, full name, company, phone
  if (step === 2) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Fill in your account details</h2>
        <div className="mb-4">
          <label>Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-900"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            minLength={8}
            required
          />
          <div className="text-xs text-gray-500">Your password must be at least 8 characters long.</div>
        </div>
        <div className="mb-4">
          <label>Full name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label>Company name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.companyName}
            onChange={e => setForm({ ...form, companyName: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label>Phone number</label>
          <input
            type="tel"
            className="w-full p-2 border rounded"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>
        <div className="flex justify-between mt-6">
          <button className="luxury-button" onClick={() => setStep(1)}>Back</button>
          <button
            className="luxury-button"
            disabled={!form.password || !form.fullName || !form.companyName || !form.phone}
            onClick={() => setStep(3)}
          >Next</button>
        </div>
        <div className="mt-4 text-right text-sm text-gray-500">Step 2/4</div>
      </div>
    );
  }

  // Step 3: Billing address
  if (step === 3) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Fill in your billing address</h2>
        <div className="mb-4">Checkout Global subscription</div>
        <div className="mb-4">
          <label>Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label>Address 2 (optional)</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.address2}
            onChange={e => setForm({ ...form, address2: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label>Postcode</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.postcode}
            onChange={e => setForm({ ...form, postcode: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label>City</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label>Country</label>
          <select
            className="w-full p-2 border rounded"
            value={form.country}
            onChange={e => setForm({ ...form, country: e.target.value })}
            required
          >
            <option value="PL">Poland</option>
            <option value="ES">Spain</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="AE">UAE</option>
            {/* Add more countries as needed */}
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <button className="luxury-button" onClick={() => setStep(2)}>Back</button>
          <button
            className="luxury-button"
            disabled={!form.address || !form.postcode || !form.city || !form.country}
            onClick={() => setStep(4)}
          >Next</button>
        </div>
        <div className="mt-4 text-right text-sm text-gray-500">Step 3/4</div>
      </div>
    );
  }

  // Step 4: Payment
  if (step === 4) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Payment</h2>
        <div className="mb-4">Checkout Global subscription</div>
        <div className="mb-4">
          <label>Name on card</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.cardName}
            onChange={e => setForm({ ...form, cardName: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label>Card number</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={form.cardNumber}
            onChange={e => setForm({ ...form, cardNumber: e.target.value })}
            required
          />
        </div>
        <div className="mb-4 flex gap-2">
          <div className="flex-1">
            <label>Expiration date</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={form.cardExp}
              onChange={e => setForm({ ...form, cardExp: e.target.value })}
              required
            />
          </div>
          <div className="flex-1">
            <label>CVV code</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={form.cardCvv}
              onChange={e => setForm({ ...form, cardCvv: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label>Your subscription</label>
          <div className={`p-2 border rounded ${form.paymentType === "yearly" ? "bg-green-50 dark:bg-green-900" : "bg-gray-50 dark:bg-gray-800"}`}>
            {form.paymentType === "yearly"
              ? <span><span className="font-bold text-green-700 dark:text-green-300">Yearly Global plan, {selectedPlan.listings} listings</span><br/>{selectedPlan.yearly} billed once per year</span>
              : <span><span className="font-bold">Monthly Global plan, {selectedPlan.listings} listings</span><br/>{selectedPlan.price} per month</span>}
          </div>
        </div>
        <div className="mb-4">
          <label>Total</label>
          <div className={`p-2 border rounded font-bold ${form.paymentType === "yearly" ? "bg-green-50 dark:bg-green-900" : "bg-gray-50 dark:bg-gray-800"}`}>
            {form.paymentType === "yearly" 
              ? selectedPlan.yearly.split(' ')[0] 
              : selectedPlan.price}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="discount">Discount code (optional)</label>
          <input
            id="discount"
            type="text"
            className="w-full p-2 border rounded"
            value={form.discount}
            onChange={e => setForm({ ...form, discount: e.target.value })}
            placeholder="Enter discount code"
          />
        </div>
        <div className="flex justify-between mt-6">
          <button className="luxury-button" onClick={() => setStep(3)}>Back</button>
          <button
            className="luxury-button"
            onClick={() => setLocation("/dashboard/agent")}
          >Pay & Subscribe</button>
        </div>
        <div className="mt-4 text-right text-sm text-gray-500">Step 4/4</div>
      </div>
    );
  }

  return null;
}
