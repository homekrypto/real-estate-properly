import { Layout } from '@/components/Layout';

export default function LegalPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6">Legal Information</h1>
        <div className="prose dark:prose-invert max-w-3xl">
          <p>
            This page provides legal information about Properly, including company details, disclaimers, and compliance notices.
          </p>
          <h2>1. Company Details</h2>
          <p>
            Properly Inc.<br />
            Headquarters: New York, NY<br />
            Email: contact@properly.com
          </p>
          <h2>2. Disclaimers</h2>
          <p>
            The information provided on Properly is for general informational purposes only. We make no warranties regarding accuracy or completeness.
          </p>
          <h2>3. Compliance</h2>
          <p>
            Properly complies with applicable laws and regulations. For specific legal inquiries, contact us at contact@properly.com.
          </p>
          <h2>4. Intellectual Property</h2>
          <p>
            All content and trademarks on Properly are protected by intellectual property laws.
          </p>
        </div>
      </div>
    </Layout>
  );
}
