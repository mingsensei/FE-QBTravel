import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Upload, 
  X, 
  User, 
  Mail, 
  MapPin, 
  FileText,
  Camera,
  Check,
  AlertCircle
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  location: string;
}

interface EditProfileProps {
  userData: UserData;
  onSave: (updatedData: Partial<UserData>) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  email: string;
  bio: string;
  location: string;
  avatar: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
}

const EditProfile: React.FC<EditProfileProps> = ({ userData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    name: userData.name,
    email: userData.email,
    bio: userData.bio,
    location: userData.location,
    avatar: userData.avatar
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.bio.length > 200) {
      newErrors.bio = 'Bio must be 200 characters or less';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewAvatar(result);
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave({
        name: formData.name.trim(),
        email: formData.email.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        avatar: formData.avatar
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ 
    label, 
    field, 
    type = 'text', 
    icon: Icon,
    placeholder,
    maxLength 
  }: {
    label: string;
    field: keyof FormData;
    type?: string;
    icon: any;
    placeholder: string;
    maxLength?: number;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={field} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={field}
          type={type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`pl-10 transition-all duration-200 ${
            errors[field as keyof FormErrors]
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
              : 'border-border focus:border-primary focus:ring-primary/20'
          }`}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      </div>
      {errors[field as keyof FormErrors] && (
        <div className="flex items-center gap-1 text-destructive text-xs animate-slide-in">
          <AlertCircle className="h-3 w-3" />
          <span>{errors[field as keyof FormErrors]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card bg-gradient-card border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-foreground">Edit Profile</CardTitle>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-soft">
                  <AvatarImage 
                    src={previewAvatar || formData.avatar} 
                    alt={formData.name} 
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {formData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 shadow-glow hover:bg-primary/90 transition-colors duration-200"
                >
                  <Camera className="h-4 w-4 text-primary-foreground" />
                </button>
              </div>

              <div className="text-center">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-medium"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Form Fields */}
            <div className="grid gap-4">
              <InputField
                label="Full Name"
                field="name"
                icon={User}
                placeholder="Enter your full name"
                maxLength={50}
              />

              <InputField
                label="Email Address"
                field="email"
                type="email"
                icon={Mail}
                placeholder="Enter your email address"
              />

              <InputField
                label="Location"
                field="location"
                icon={MapPin}
                placeholder="Enter your location"
                maxLength={100}
              />

              {/* Bio Field */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-foreground">
                  Bio
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className={`pl-10 min-h-20 resize-none transition-all duration-200 ${
                      errors.bio
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
                        : 'border-border focus:border-primary focus:ring-primary/20'
                    }`}
                    placeholder="Tell us about yourself..."
                    maxLength={200}
                  />
                </div>
                <div className="flex justify-between items-center">
                  {errors.bio && (
                    <div className="flex items-center gap-1 text-destructive text-xs animate-slide-in">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.bio}</span>
                    </div>
                  )}
                  <span className={`text-xs ml-auto ${
                    formData.bio.length > 180 ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {formData.bio.length}/200
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="default"
                className="flex-1 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;