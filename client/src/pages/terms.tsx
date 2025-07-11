import { Layout } from '@/components/Layout';

export default function TermsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-3xl">
          <p>
            Welcome to Properly. These Terms of Service govern your use of our website and services. By accessing or using Properly, you agree to comply with these terms. Please read them carefully.
          </p>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using Properly, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.
          </p>
          <h2>2. Use of Services</h2>
          <p>
            You may use Properly for lawful purposes only. You must not misuse our services or attempt to access them in unauthorized ways.
          </p>
          <h2>3. Intellectual Property</h2>
          <p>
            All content, trademarks, and data on Properly are the property of Properly or its licensors. You may not reproduce, distribute, or create derivative works without permission.
          </p>
          <h2>4. Limitation of Liability</h2>
          <p>
            Properly is provided "as is" without warranties. We are not liable for any damages arising from your use of our services.
          </p>
          <h2>5. Changes to Terms</h2>
          <p>
            We may update these Terms of Service at any time. Continued use of Properly means you accept the changes.
          </p>
          <h2>6. Contact</h2>
          <p>
            For questions about these terms, contact us at contact@properly.com.
          </p>
        </div>
      </div>
    </Layout>
  );
}
