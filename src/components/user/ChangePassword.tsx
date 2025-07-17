import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  Check, 
  AlertCircle,
  Shield
} from 'lucide-react';

interface ChangePasswordProps {
  onSave: () => void;
  onCancel: () => void;
}

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    };
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const validation = validatePassword(formData.newPassword);
      if (!validation.isValid) {
        newErrors.newPassword = 'Password must meet all requirements';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword && formData.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically make an API call to change the password
      // For now, we'll just simulate success
      onSave();
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors({ currentPassword: 'Current password is incorrect' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordField = ({ 
    label, 
    field, 
    placeholder,
    showKey
  }: {
    label: string;
    field: keyof FormData;
    placeholder: string;
    showKey: keyof typeof showPasswords;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={field} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={field}
          type={showPasswords[showKey] ? 'text' : 'password'}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`pl-10 pr-10 transition-all duration-200 ${
            errors[field]
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
              : 'border-border focus:border-primary focus:ring-primary/20'
          }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(showKey)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          {showPasswords[showKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {errors[field] && (
        <div className="flex items-center gap-1 text-destructive text-xs animate-slide-in">
          <AlertCircle className="h-3 w-3" />
          <span>{errors[field]}</span>
        </div>
      )}
    </div>
  );

  const passwordValidation = validatePassword(formData.newPassword);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-card bg-gradient-card border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">Change Password</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onCancel}
              className="hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordField
              label="Current Password"
              field="currentPassword"
              placeholder="Enter your current password"
              showKey="current"
            />

            <PasswordField
              label="New Password"
              field="newPassword"
              placeholder="Enter your new password"
              showKey="new"
            />

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="space-y-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                <h4 className="text-sm font-medium text-foreground">Password Requirements:</h4>
                <div className="space-y-1">
                  {[
                    { key: 'minLength', text: 'At least 8 characters', valid: passwordValidation.minLength },
                    { key: 'hasUpperCase', text: 'One uppercase letter', valid: passwordValidation.hasUpperCase },
                    { key: 'hasLowerCase', text: 'One lowercase letter', valid: passwordValidation.hasLowerCase },
                    { key: 'hasNumber', text: 'One number', valid: passwordValidation.hasNumber },
                    { key: 'hasSpecialChar', text: 'One special character', valid: passwordValidation.hasSpecialChar }
                  ].map((req) => (
                    <div key={req.key} className="flex items-center gap-2 text-xs">
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                        req.valid ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                      }`}>
                        {req.valid && <Check className="h-2 w-2" />}
                      </div>
                      <span className={req.valid ? 'text-green-700' : 'text-muted-foreground'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <PasswordField
              label="Confirm New Password"
              field="confirmPassword"
              placeholder="Confirm your new password"
              showKey="confirm"
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="default"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="link"
                className="flex-1 font-medium"
                disabled={isSubmitting || !passwordValidation.isValid}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Security Tips */}
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Security Tips:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Use a unique password you don't use elsewhere</li>
              <li>• Consider using a password manager</li>
              <li>• Never share your password with anyone</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;