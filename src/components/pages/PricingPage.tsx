import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { Check, Star, Zap, Crown, Users, Calendar, BarChart3, Headphones } from 'lucide-react';
import UnifiedAuthModal from '../auth/UnifiedAuthModal';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
  color: string;
  maxEvents: string;
  maxAttendees: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'month',
    description: 'Perfect for small events and getting started',
    features: [
      'Up to 2 events per month',
      'Up to 50 attendees per event',
      'Basic event page customization',
      'Email support',
      'Basic analytics',
      'Mobile-responsive event pages'
    ],
    icon: Users,
    color: 'from-gray-600 to-gray-700',
    maxEvents: '2 events/month',
    maxAttendees: '50 attendees'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49,
    period: 'month',
    description: 'Ideal for regular event organizers',
    features: [
      'Up to 10 events per month',
      'Up to 500 attendees per event',
      'Advanced customization options',
      'Priority email support',
      'Detailed analytics & reporting',
      'Custom branding',
      'Integration with marketing tools',
      'Attendee management system'
    ],
    popular: true,
    icon: Star,
    color: 'from-indigo-600 to-purple-600',
    maxEvents: '10 events/month',
    maxAttendees: '500 attendees'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    period: 'month',
    description: 'For large organizations and frequent events',
    features: [
      'Unlimited events',
      'Unlimited attendees',
      'White-label solution',
      'Dedicated account manager',
      'Advanced analytics & insights',
      'Custom integrations',
      'API access',
      'Multi-user team management',
      'Priority phone support',
      'Custom training sessions'
    ],
    icon: Crown,
    color: 'from-purple-600 to-pink-600',
    maxEvents: 'Unlimited',
    maxAttendees: 'Unlimited'
  }
];

const features = [
  {
    category: 'Event Management',
    items: [
      'Event page builder',
      'Registration management',
      'Ticketing system',
      'Attendee check-in',
      'Speaker management'
    ]
  },
  {
    category: 'Marketing & Promotion',
    items: [
      'Social media integration',
      'Email marketing tools',
      'SEO optimization',
      'Custom landing pages',
      'Promotional codes'
    ]
  },
  {
    category: 'Analytics & Insights',
    items: [
      'Real-time analytics',
      'Attendee insights',
      'Revenue tracking',
      'Performance reports',
      'ROI measurement'
    ]
  },
  {
    category: 'Support & Training',
    items: [
      '24/7 customer support',
      'Knowledge base access',
      'Video tutorials',
      'Best practices guides',
      'Community forum'
    ]
  }
];

const PricingPage: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const { isAuthenticated } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  React.useEffect(() => {
    setBreadcrumbs(['Pricing']);
  }, [setBreadcrumbs]);

  const getDiscountedPrice = (price: number) => {
    return billingPeriod === 'yearly' ? Math.round(price * 0.8) : price;
  };

  const handlePlanSelect = (planId: string) => {
    if (!isAuthenticated) {
      setSelectedPlan(planId);
      setShowAuthModal(true);
    } else {
      // User is already authenticated, handle plan upgrade
      alert(`Plan upgrade to ${planId} would be handled here`);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful auth, redirect to unified dashboard
    setCurrentView('dashboard');
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            PRICING PLANS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your event organizing needs. Start free and scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                billingPeriod === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                billingPeriod === 'yearly'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            const discountedPrice = getDiscountedPrice(plan.price);
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                  plan.popular ? 'ring-2 ring-indigo-600' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ₹{discountedPrice}
                      </span>
                      <span className="text-gray-600 ml-1">/{plan.period}</span>
                    </div>
                    {billingPeriod === 'yearly' && plan.price > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Save ₹{(plan.price - discountedPrice) * 12}/year
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>{plan.maxEvents}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>{plan.maxAttendees}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.price === 0 ? 'Get Started Free' : 'Start Free Trial'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((featureGroup, index) => (
              <div
                key={index}
                className="space-y-4"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{featureGroup.category}</h3>
                <ul className="space-y-2">
                  {featureGroup.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">All paid plans come with a 14-day free trial. No credit card required to start.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer custom plans?</h3>
                <p className="text-gray-600">Yes, we offer custom enterprise plans for large organizations with specific needs.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                <p className="text-gray-600">Absolutely. We use enterprise-grade security and comply with GDPR and SOC 2 standards.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">Yes, you can cancel your subscription at any time. No long-term contracts required.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-600 mb-6">
            Contact our sales team to discuss enterprise plans and custom requirements
          </p>
          <button
            onClick={() => setCurrentView('contact')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Contact Sales
          </button>
        </div>
      </div>

      {/* Auth Modal for Plan Selection */}
      <UnifiedAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleAuthSuccess}
        defaultRole="user"
        redirectTo="/dashboard"
      />
    </div>
  );
};

export default PricingPage;