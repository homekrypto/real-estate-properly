import { Layout } from '@/components/Layout';

export default function CookiePolicyPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        <div className="prose dark:prose-invert max-w-3xl">
          <p>
            This Cookie Policy explains how Properly uses cookies and similar technologies on our website.
          </p>
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device to help websites function and collect information about your usage.
          </p>
          <h2>2. How We Use Cookies</h2>
          <p>
            We use cookies to remember your preferences, analyze site traffic, and improve your experience.
          </p>
          <h2>3. Managing Cookies</h2>
          <p>
            You can manage or disable cookies in your browser settings. Disabling cookies may affect site functionality.
          </p>
          <h2>4. Changes</h2>
          <p>
            We may update this Cookie Policy. Continued use of Properly means you accept the changes.
          </p>
        </div>
      </div>
    </Layout>
  );
}
