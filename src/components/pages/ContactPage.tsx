import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Mail, Phone, MapPin, Send, Clock, Globe, MessageCircle, Navigation, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    details: 'tanmay365210mogabeera@gmail.com',
    description: 'Send us an email anytime',
    color: 'bg-blue-500'
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+91 8652601487',
    description: 'Mon-Fri from 8am to 6pm',
    color: 'bg-green-500'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: 'MHB colony Ambernath (w), Thane, Maharashtra',
    description: 'Come say hello at our office',
    color: 'bg-purple-500'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: 'Mon-Fri: 8am-6pm PST',
    description: 'Weekend support available',
    color: 'bg-orange-500'
  }
];

const ContactPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setBreadcrumbs(['Contact Us']);
  }, [setBreadcrumbs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // --- Hardcoded EmailJS Keys ---
    const serviceID = 'service_2ffjwl1';
    const templateID = 'template_wuuy28k';
    const publicKey = 'i0R5WH3ZGcO26qzt3';
    // -----------------------------

    emailjs.sendForm(serviceID, templateID, form.current, publicKey)
    .then((result) => {
        console.log('EmailJS Success:', result.text);
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: '',
          inquiryType: 'general'
        });
    }, (error) => {
        console.error('EmailJS Error:', error.text);
        setSubmitStatus('error');
        setErrorMessage('Failed to send message. Please try again later or email us directly.');
    })
    .finally(() => {
        setIsSubmitting(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            CONTACT US
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to create amazing events? Let's talk about your vision and make it happen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-4 group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`flex-shrink-0 w-12 h-12 ${info.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold mb-1">{info.title}</h4>
                        <p className="text-gray-900 font-medium">{info.details}</p>
                        <p className="text-gray-600 text-sm">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Office Location */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Navigation className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Our Office</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">EventEase Headquarters</h4>
                    <p className="text-sm text-gray-600">MHB colony Ambernath (w), Thane, Maharashtra</p>
                  </div>
                </div>
                <div className="text-gray-600 text-sm space-y-2">
                  <p>📍 Located in Ambernath, Thane district</p>
                  <p>🚇 Near Ambernath Railway Station</p>
                  <p>🅿️ Visitor parking available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-8">
                <MessageCircle className="w-8 h-8 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-900">Send us a message</h3>
              </div>
              
              {submitStatus === 'success' && (
                <div className="p-4 mb-6 bg-green-50 border-l-4 border-green-400 text-green-700">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 mr-3"/>
                    <div>
                      <p className="font-bold">Message Sent!</p>
                      <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-400 text-red-700">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 mr-3"/>
                    <div>
                      <p className="font-bold">Something went wrong</p>
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      autoComplete="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      autoComplete="organization"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      autoComplete="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="+91 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="What's this about?"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales Question</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press & Media</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Tell us about your event ideas, requirements, or any questions you have..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Available Worldwide</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
