import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { MapPin, Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
}

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState<FormData>({ email: '', password: '' });
  const [registerData, setRegisterData] = useState<FormData>({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateLoginForm = () => {
    const errors: FormErrors = {};
    
    if (!loginData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(loginData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!loginData.password) {
      errors.password = 'Password is required';
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors: FormErrors = {};
    
    if (!registerData.name) {
      errors.name = 'Name is required';
    }
    
    if (!registerData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(registerData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(registerData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!registerData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLoginForm()) {
      console.log('Login attempt:', loginData);
      // Handle login logic here
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRegisterForm()) {
      console.log('Register attempt:', registerData);
      // Handle registration logic here
    }
  };

  const InputField = ({ 
    label, 
    type, 
    value, 
    onChange, 
    error, 
    icon: Icon, 
    showPasswordToggle = false,
    showPassword: showPass,
    onTogglePassword 
  }: {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    icon: any;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(' ', '-')} className="text-sm font-medium bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={label.toLowerCase().replace(' ', '-')}
          type={showPasswordToggle ? (showPass ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pl-10 pr-10 transition-all duration-200 ${
            error 
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
              : 'border-green-700 focus:border-primary focus:ring-primary/20'
          }`}
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1 text-destructive text-xs animate-slide-in">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <MapPin className="h-10 w-10 text-primary" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-glow rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Quang Binh Travel Map
            </h1>
          </div>
          <p className="text-primary-glow text-sm">
            Discover the hidden gems of Quang Binh Province
          </p>
        </div>

        <Card className="shadow-lg bg-white border-primary/30 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-primary/10">
                <TabsTrigger value="login" className="text-sm font-medium data-[state=active]:text-primary data-[state=active]:bg-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="text-sm font-medium data-[state=active]:text-primary data-[state=active]:bg-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2 text-center">
                  <CardTitle className="text-xl font-semibold text-primary">Welcome back!</CardTitle>
                  <CardDescription className="text-primary-glow">
                    Sign in to your account to continue exploring
                  </CardDescription>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <InputField
                    label="Email"
                    type="email"
                    value={loginData.email}
                    onChange={(value) => setLoginData({ ...loginData, email: value })}
                    error={loginErrors.email}
                    icon={Mail}
                  />

                  <InputField
                    label="Password"
                    type="password"
                    value={loginData.password}
                    onChange={(value) => setLoginData({ ...loginData, password: value })}
                    error={loginErrors.password}
                    icon={Lock}
                    showPasswordToggle
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/20"
                      />
                      <label htmlFor="remember" className="text-sm text-muted-foreground">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary-glow underline-offset-4 hover:underline transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full font-medium bg-gradient-to-r from-primary to-primary-glow text-white"
                    size="lg"
                  >
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2 text-center">
                  <CardTitle className="text-xl font-semibold text-primary">Create Account</CardTitle>
                  <CardDescription className="text-primary-glow">
                    Join us to start your travel adventure
                  </CardDescription>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <InputField
                    label="Full Name"
                    type="text"
                    value={registerData.name || ''}
                    onChange={(value) => setRegisterData({ ...registerData, name: value })}
                    error={registerErrors.name}
                    icon={User}
                  />

                  <InputField
                    label="Email"
                    type="email"
                    value={registerData.email}
                    onChange={(value) => setRegisterData({ ...registerData, email: value })}
                    error={registerErrors.email}
                    icon={Mail}
                  />

                  <InputField
                    label="Password"
                    type="password"
                    value={registerData.password}
                    onChange={(value) => setRegisterData({ ...registerData, password: value })}
                    error={registerErrors.password}
                    icon={Lock}
                    showPasswordToggle
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />

                  <InputField
                    label="Confirm Password"
                    type="password"
                    value={registerData.confirmPassword || ''}
                    onChange={(value) => setRegisterData({ ...registerData, confirmPassword: value })}
                    error={registerErrors.confirmPassword}
                    icon={Lock}
                    showPasswordToggle
                    showPassword={showConfirmPassword}
                    onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  />

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/20"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the{' '}
                      <button
                        type="button"
                        className="text-primary hover:text-primary-glow underline-offset-4 hover:underline"
                      >
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        className="text-primary hover:text-primary-glow underline-offset-4 hover:underline"
                      >
                        Privacy Policy
                      </button>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full font-medium bg-gradient-to-r from-primary to-primary-glow text-white"
                    size="lg"
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Social Login Section */}
            <div className="space-y-4">
  <div className="flex items-center w-full">
    <span className="flex-1 border-t border-green-400"></span>
    <span className="px-2 text-primary font-semibold text-xs uppercase whitespace-nowrap">
      Or continue with
    </span>
    <span className="flex-1 border-t border-green-400"></span>
  </div>


              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="font-medium bg-white border-green-400 text-primary hover:bg-green-50 hover:text-primary hover:border-primary transition-colors">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="font-medium bg-white border-green-400 text-primary hover:bg-green-50 hover:text-primary hover:border-primary transition-colors">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
              className="text-primary hover:text-primary-glow underline-offset-4 hover:underline transition-colors duration-200 font-medium"
            >
              {activeTab === 'login' ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;