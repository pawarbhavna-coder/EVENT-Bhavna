import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { FileText, Shield, Users, CreditCard } from 'lucide-react';

const TermsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs(['Terms of Service']);
  }, [setBreadcrumbs]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: January 1, 2024
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to EventEase. These Terms of Service ("Terms") govern your use of our event management platform and services. By accessing or using EventEase, you agree to be bound by these Terms.
            </p>
          </div>

          {/* Account Terms */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <span>2. Account Terms</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>• You must be 18 years or older to use this service</p>
              <p>• You must provide accurate and complete registration information</p>
              <p>• You are responsible for maintaining the security of your account</p>
              <p>• You may not use the service for any illegal or unauthorized purpose</p>
              <p>• You must not transmit any worms, viruses, or destructive code</p>
            </div>
          </div>

          {/* Service Terms */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              <span>3. Service Terms</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>• EventEase provides event management and planning tools</p>
              <p>• We reserve the right to modify or discontinue the service at any time</p>
              <p>• Service availability is not guaranteed and may be subject to maintenance</p>
              <p>• You retain ownership of content you create using our platform</p>
              <p>• We may use aggregated, anonymized data for service improvement</p>
            </div>
          </div>

          {/* Payment Terms */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CreditCard className="w-6 h-6 text-indigo-600" />
              <span>4. Payment Terms</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>• Subscription fees are billed in advance on a monthly or yearly basis</p>
              <p>• All fees are non-refundable except as required by law</p>
              <p>• We reserve the right to change pricing with 30 days notice</p>
              <p>• Failed payments may result in service suspension</p>
              <p>• You can cancel your subscription at any time</p>
            </div>
          </div>

          {/* Privacy & Security */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <span>5. Privacy & Security</span>
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>• We take your privacy seriously and protect your personal information</p>
              <p>• Our Privacy Policy explains how we collect and use your data</p>
              <p>• We implement industry-standard security measures</p>
              <p>• You are responsible for maintaining the confidentiality of your login credentials</p>
              <p>• Report any security vulnerabilities to security@eventease.com</p>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              EventEase shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
            </p>
          </div>

          {/* Governing Law */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be interpreted and governed by the laws of the State of California, without regard to its conflict of law provisions.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Questions about these Terms?</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📧 legal@eventease.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 123 Event Street, San Francisco, CA 94102</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;