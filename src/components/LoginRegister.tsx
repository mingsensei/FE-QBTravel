import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { MapPin, Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle, Loader2, Phone } from 'lucide-react';

interface FormData {
  // Common fields
  password: string;
  username?: string;
  // Register specific fields
  email?: string;
  fullName?: string;
  phone?: string;
  confirmPassword?: string;
  role?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  username?: string;
  fullName?: string;
  phone?: string;
  confirmPassword?: string;
}

// Thêm interface để định nghĩa props cho InputField
interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon: React.ComponentType<{ className?: string }>;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const InputField = ({
  label, type, value, onChange, error, icon: Icon,
  showPasswordToggle = false, showPassword: showPass, onTogglePassword
}: InputFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={label.toLowerCase().replace(/\s/g, '-')} className="text-sm font-medium text-foreground">
      {label}
    </Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id={label.toLowerCase().replace(/\s/g, '-')}
        type={showPasswordToggle ? (showPass ? 'text' : 'password') : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-10 pr-10 transition-all duration-200 ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/20'}`}
        placeholder={`Nhập ${label.toLowerCase()} của bạn`}
      />
      {showPasswordToggle && (
        <button type="button" onClick={onTogglePassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
    {error && (
      <div className="flex items-center gap-1 text-destructive text-xs">
        <AlertCircle className="h-3 w-3" />
        <span>{error}</span>
      </div>
    )}
  </div>
);


const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState<FormData>({ username: '', password: '' });
  
  const [registerData, setRegisterData] = useState<FormData>({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });

  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({});

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateLoginForm = () => {
    const errors: FormErrors = {};
    if (!loginData.username) {
      errors.username = 'Username is required';
    }
    if (!loginData.password) {
      errors.password = 'Password is required';
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors: FormErrors = {};
    if (!registerData.username) errors.username = 'Username is required';
    if (!registerData.fullName) errors.fullName = 'Full name is required';
    if (!registerData.phone) errors.phone = 'Phone number is required';

    if (!registerData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(registerData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(registerData.password)) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearNotifications = () => {
    setApiError(null);
    setApiSuccess(null);
  }

  // Hàm chuyển hướng đến trang home
  const redirectToHome = () => {
    // Thay đổi URL này thành đường dẫn trang home của bạn
    window.location.href = '/';
    // Hoặc nếu bạn dùng React Router, có thể dùng:
    // navigate('/home');
  };

  // --- HÀM XỬ LÝ LOGIN ---
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearNotifications();

    if (!validateLoginForm()) return;

    setIsLoading(true);
    try {
      const API_ENDPOINT = 'http://localhost:8081/api/auth/login';
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Đăng nhập thất bại. Vui lòng thử lại.');

      // Lưu token vào localStorage
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      
      // Hiển thị thông báo thành công
      setApiSuccess('Đăng nhập thành công! Đang chuyển hướng...');
      
      // Chuyển hướng đến trang home sau 1.5 giây
      setTimeout(() => {
        redirectToHome();
      }, 1500);

    } catch (error) {
      console.error('Login error:', error);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- HÀM XỬ LÝ REGISTER ---
  const handleRegisterSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearNotifications();

    if (!validateRegisterForm()) return;

    setIsLoading(true);
    try {
      const API_ENDPOINT = 'http://localhost:8081/api/auth/register';
      const { confirmPassword, ...payload } = registerData;
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(resultText || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
      
      if (resultText !== 'Register Success') {
          console.warn("Register API returned an unexpected success message:", resultText);
      }

      setApiSuccess('Đăng ký thành công! Vui lòng chuyển qua tab đăng nhập.');
      setTimeout(() => {
        setActiveTab('login');
        clearNotifications();
      }, 2000);

    } catch (error) {
      console.error('Register error:', error);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="h-10 w-10 text-green-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Quang Binh Travel Map</h1>
          </div>
          <p className="text-gray-600 text-sm">Khám phá những viên ngọc ẩn của tỉnh Quảng Bình</p>
        </div>

        <Card className="shadow-xl bg-white/95 border-gray-200 backdrop-blur-sm">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={(tab) => { setActiveTab(tab); clearNotifications(); }} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {apiError && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span>{apiError}</span>
              </div>
            )}
            {apiSuccess && (
              <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
                <CheckCircle className="h-4 w-4" />
                <span>{apiSuccess}</span>
              </div>
            )}
            <Tabs value={activeTab}>
              <TabsContent value="login">
                <div className="space-y-2 text-center mb-4">
                  <CardTitle className="text-xl font-semibold">Chào mừng trở lại!</CardTitle>
                  <CardDescription>Đăng nhập vào tài khoản của bạn</CardDescription>
                </div>
                <div className="space-y-4">
                  <InputField
                    label="Tên đăng nhập"
                    type="text"
                    value={loginData.username || ''}
                    onChange={(value) => setLoginData({ ...loginData, username: value })}
                    error={loginErrors.username}
                    icon={User}
                  />
                  <InputField
                    label="Mật khẩu"
                    type="password"
                    value={loginData.password}
                    onChange={(value) => setLoginData({ ...loginData, password: value })}
                    error={loginErrors.password}
                    icon={Lock}
                    showPasswordToggle
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                  <Button type="button" onClick={handleLoginSubmit} className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading && activeTab === 'login' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /><span>Đang đăng nhập...</span></> : 'Đăng nhập'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register">
                 <div className="space-y-2 text-center mb-4">
                  <CardTitle className="text-xl font-semibold">Tạo tài khoản</CardTitle>
                  <CardDescription>Tham gia cùng chúng tôi để bắt đầu cuộc phiêu lưu du lịch của bạn</CardDescription>
                </div>
                <div className="space-y-4">
                    <InputField
                        label="Tên đăng nhập" type="text" value={registerData.username || ''}
                        onChange={(value) => setRegisterData({ ...registerData, username: value })}
                        error={registerErrors.username} icon={User}
                    />
                    <InputField
                        label="Họ và Tên" type="text" value={registerData.fullName || ''}
                        onChange={(value) => setRegisterData({ ...registerData, fullName: value })}
                        error={registerErrors.fullName} icon={User}
                    />
                     <InputField
                        label="Số điện thoại" type="tel" value={registerData.phone || ''}
                        onChange={(value) => setRegisterData({ ...registerData, phone: value })}
                        error={registerErrors.phone} icon={Phone}
                    />
                    <InputField
                        label="Email" type="email" value={registerData.email || ''}
                        onChange={(value) => setRegisterData({ ...registerData, email: value })}
                        error={registerErrors.email} icon={Mail}
                    />
                    <InputField
                        label="Mật khẩu" type="password" value={registerData.password || ''}
                        onChange={(value) => setRegisterData({ ...registerData, password: value })}
                        error={registerErrors.password} icon={Lock}
                        showPasswordToggle showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                    <InputField
                        label="Xác nhận mật khẩu" type="password" value={registerData.confirmPassword || ''}
                        onChange={(value) => setRegisterData({ ...registerData, confirmPassword: value })}
                        error={registerErrors.confirmPassword} icon={Lock}
                        showPasswordToggle showPassword={showConfirmPassword}
                        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                     <Button type="button" onClick={handleRegisterSubmit} className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                        {isLoading && activeTab === 'register' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /><span>Đang tạo...</span></> : 'Tạo tài khoản'}
                    </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginRegister;