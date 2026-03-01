import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, Building, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { supabase } from '../../lib/supabaseConfig';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  defaultRole?: 'attendee' | 'organizer' | 'sponsor';
  redirectTo?: string;
}

type UserRole = 'attendee' | 'organizer' | 'sponsor';

const UnifiedAuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  defaultRole = 'attendee',
  redirectTo 
}) => {
  const { setCurrentView } = useApp();
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLoginMode) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      if (isLoginMode) {
        console.log('Attempting login for:', formData.email);
        await login(formData.email, formData.password, selectedRole);
        
        // Handle redirection after successful login
        if (redirectTo) {
          setCurrentView(redirectTo as any);
        } else {
          // Default redirection based on role
          switch (selectedRole) {
            case 'organizer':
              setCurrentView('organizer-dashboard');
              break;
            case 'admin':
              setCurrentView('admin-dashboard');
              break;
            default:
              setCurrentView('attendee-dashboard');
          }
        }
      } else {
        console.log('Attempting registration for:', formData.email, 'with role:', selectedRole);
        await register(formData.email, formData.password, formData.name, selectedRole, formData.company);
        
        console.log('Registration completed, checking profile...');
        
        // Wait a moment for profile creation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if profile was created
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError) {
            console.error('Profile check failed:', profileError);
            setErrors({ general: 'Account created but profile setup failed. Please try logging in.' });
            return;
          } else {
            console.log('Profile verified:', profile);
            alert('Account created successfully! You are now logged in.');
          }
        }
        
        // After registration, redirect to appropriate dashboard
        if (redirectTo) {
          setCurrentView(redirectTo as any);
        } else {
          switch (selectedRole) {
            case 'organizer':
              setCurrentView('organizer-dashboard');
              break;
            case 'admin':
              setCurrentView('admin-dashboard');
              break;
            default:
              setCurrentView('attendee-dashboard');
          }
        }
      }
      
      onLoginSuccess({} as any);
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error instanceof Error) {
        // Handle specific Supabase errors
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Password')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('permission denied') || error.message.includes('RLS')) {
          errorMessage = 'Database connection issue. Please try again or contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrors({});
    setFormData({ name: '', email: '', password: '', confirmPassword: '', company: '' });
  };

  const roleOptions = [
    { 
      value: 'attendee', 
      label: 'Attendee', 
      description: 'Join and attend events',
      icon: User
    },
    { 
      value: 'organizer', 
      label: 'Event Organizer', 
      description: 'Create and manage events',
      icon: Calendar
    },
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 max-h-screen overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="p-8 pb-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isLoginMode ? 'Welcome Back' : 'Join EventEase'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLoginMode ? 'Sign in to access your account' : 'Create your account to get started'}
            </p>
          </div>

          {/* Role Selection for Login */}
          {isLoginMode && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value as UserRole)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedRole === role.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <role.icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{role.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <>
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                     autoComplete="name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="company"
                      placeholder="Company (Optional)"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Role Selection for Signup */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I want to join as:
                  </label>
                  <div className="space-y-2">
                    {roleOptions.map((role) => (
                      <label key={role.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={selectedRole === role.value}
                          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                          className="mt-1 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{role.label}</p>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                 autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                 autoComplete={isLoginMode ? "current-password" : "new-password"}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {!isLoginMode && (
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                   autoComplete="new-password"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isLoginMode ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                isLoginMode ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={toggleMode}
                className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
              >
                {isLoginMode ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
            {isLoginMode && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setCurrentView('password-reset');
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAuthModal;
