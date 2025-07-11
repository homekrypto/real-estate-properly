import { Layout } from '@/components/Layout';

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-3xl">
          <p>
            This Privacy Policy explains how Properly collects, uses, and protects your personal information. By using our website, you consent to the practices described herein.
          </p>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly, such as when you register, contact us, or use our services. We may also collect usage data and cookies.
          </p>
          <h2>2. Use of Information</h2>
          <p>
            We use your information to provide, improve, and personalize our services, communicate with you, and comply with legal obligations.
          </p>
          <h2>3. Sharing of Information</h2>
          <p>
            We do not sell your personal information. We may share it with service providers or as required by law.
          </p>
          <h2>4. Data Security</h2>
          <p>
            We implement security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
          </p>
          <h2>5. Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal data by contacting us at contact@properly.com.
          </p>
          <h2>6. Changes</h2>
          <p>
            We may update this Privacy Policy. Continued use of Properly means you accept the changes.
          </p>
        </div>
      </div>
    </Layout>
  );
}
