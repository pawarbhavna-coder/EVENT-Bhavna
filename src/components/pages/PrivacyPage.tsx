import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Shield, Eye, Database, Lock, Users, Globe } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();

  React.useEffect(() => {
    setBreadcrumbs(['Privacy Policy']);
  }, [setBreadcrumbs]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: January 1, 2024
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <span>1. Introduction</span>
            </h2>
            <p className="text-gray-700 leading-relaxed">
              EventEase ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our event management platform and services.
            </p>
          </div>

          {/* Information We Collect */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Database className="w-6 h-6 text-indigo-600" />
              <span>2. Information We Collect</span>
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Name, email address, and contact information</li>
                  <li>• Account credentials and profile information</li>
                  <li>• Payment and billing information</li>
                  <li>• Event registration and attendance data</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Information</h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Device information and IP address</li>
                  <li>• Browser type and operating system</li>
                  <li>• Pages visited and time spent on our platform</li>
                  <li>• Interaction with events and content</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Eye className="w-6 h-6 text-indigo-600" />
              <span>3. How We Use Your Information</span>
            </h2>
            <div className="text-gray-700 space-y-2">
              <p>• Provide and maintain our event management services</p>
              <p>• Process transactions and send related information</p>
              <p>• Send administrative information and updates</p>
              <p>• Respond to customer service requests</p>
              <p>• Improve our platform and develop new features</p>
              <p>• Prevent fraud and enhance security</p>
              <p>• Comply with legal obligations</p>
            </div>
          </div>

          {/* Information Sharing */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <span>4. Information Sharing</span>
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
              <ul className="space-y-2 ml-4">
                <li>• With event organizers when you register for their events</li>
                <li>• With service providers who assist in our operations</li>
                <li>• When required by law or to protect our rights</li>
                <li>• In connection with a business transfer or acquisition</li>
                <li>• With your explicit consent</li>
              </ul>
            </div>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Lock className="w-6 h-6 text-indigo-600" />
              <span>5. Data Security</span>
            </h2>
            <div className="text-gray-700 space-y-2">
              <p>• We use industry-standard encryption to protect your data</p>
              <p>• Regular security audits and vulnerability assessments</p>
              <p>• Secure data centers with 24/7 monitoring</p>
              <p>• Employee access controls and training</p>
              <p>• Incident response procedures for security breaches</p>
            </div>
          </div>

          {/* International Transfers */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Globe className="w-6 h-6 text-indigo-600" />
              <span>6. International Data Transfers</span>
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </div>

          {/* Your Rights */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <div className="text-gray-700 space-y-2">
              <p>You have the right to:</p>
              <ul className="space-y-1 ml-4">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate information</li>
                <li>• Delete your account and data</li>
                <li>• Export your data</li>
                <li>• Opt-out of marketing communications</li>
                <li>• File a complaint with supervisory authorities</li>
              </ul>
            </div>
          </div>

          {/* Cookies */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie settings through your browser preferences.
            </p>
          </div>

          {/* Children's Privacy */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </div>

          {/* Changes to Policy */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Us About Privacy</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📧 privacy@eventease.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 123 Event Street, San Francisco, CA 94102</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;