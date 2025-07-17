import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Heart, 
  Camera, 
  X, 
  Check,
  Shield,
  Smartphone,
  Globe,
  Eye
} from 'lucide-react';

interface AccountSettingsProps {
  onSave: () => void;
  onCancel: () => void;
}

interface NotificationSettings {
  email: {
    newComments: boolean;
    newLikes: boolean;
    newFollowers: boolean;
    weeklyDigest: boolean;
    marketingEmails: boolean;
  };
  push: {
    newComments: boolean;
    newLikes: boolean;
    newFollowers: boolean;
    liveUpdates: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showActivity: boolean;
    showLocation: boolean;
    allowMessages: boolean;
  };
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onSave, onCancel }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      newComments: true,
      newLikes: false,
      newFollowers: true,
      weeklyDigest: true,
      marketingEmails: false
    },
    push: {
      newComments: true,
      newLikes: false,
      newFollowers: true,
      liveUpdates: false
    },
    privacy: {
      profileVisible: true,
      showActivity: true,
      showLocation: true,
      allowMessages: true
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSettingChange = (
    category: keyof NotificationSettings,
    setting: string,
    value: boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to save settings
      console.log('Saving settings:', settings);
      onSave();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SettingsSection = ({ 
    title, 
    description, 
    icon: Icon,
    children 
  }: {
    title: string;
    description: string;
    icon: any;
    children: React.ReactNode;
  }) => (
    <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-background/50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-3 ml-11">
        {children}
      </div>
    </div>
  );

  const SettingItem = ({ 
    label, 
    description, 
    checked, 
    onChange,
    icon: Icon
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon?: any;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <div>
          <Label className="text-sm font-medium text-foreground cursor-pointer">
            {label}
          </Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card bg-gradient-card border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">Account Settings</CardTitle>
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
          {/* Email Notifications */}
          <SettingsSection
            title="Email Notifications"
            description="Choose which emails you'd like to receive"
            icon={Mail}
          >
            <SettingItem
              label="New Comments"
              description="Get notified when someone comments on your posts"
              checked={settings.email.newComments}
              onChange={(checked) => handleSettingChange('email', 'newComments', checked)}
              icon={MessageSquare}
            />
            <SettingItem
              label="New Likes"
              description="Get notified when someone likes your content"
              checked={settings.email.newLikes}
              onChange={(checked) => handleSettingChange('email', 'newLikes', checked)}
              icon={Heart}
            />
            <SettingItem
              label="New Followers"
              description="Get notified when someone follows you"
              checked={settings.email.newFollowers}
              onChange={(checked) => handleSettingChange('email', 'newFollowers', checked)}
            />
            <SettingItem
              label="Weekly Digest"
              description="Receive a weekly summary of your activity"
              checked={settings.email.weeklyDigest}
              onChange={(checked) => handleSettingChange('email', 'weeklyDigest', checked)}
            />
            <SettingItem
              label="Marketing Emails"
              description="Receive updates about new features and promotions"
              checked={settings.email.marketingEmails}
              onChange={(checked) => handleSettingChange('email', 'marketingEmails', checked)}
            />
          </SettingsSection>

          {/* Push Notifications */}
          <SettingsSection
            title="Push Notifications"
            description="Manage notifications on your device"
            icon={Smartphone}
          >
            <SettingItem
              label="New Comments"
              description="Push notifications for new comments"
              checked={settings.push.newComments}
              onChange={(checked) => handleSettingChange('push', 'newComments', checked)}
              icon={MessageSquare}
            />
            <SettingItem
              label="New Likes"
              description="Push notifications for new likes"
              checked={settings.push.newLikes}
              onChange={(checked) => handleSettingChange('push', 'newLikes', checked)}
              icon={Heart}
            />
            <SettingItem
              label="New Followers"
              description="Push notifications for new followers"
              checked={settings.push.newFollowers}
              onChange={(checked) => handleSettingChange('push', 'newFollowers', checked)}
            />
            <SettingItem
              label="Live Updates"
              description="Real-time notifications for activity"
              checked={settings.push.liveUpdates}
              onChange={(checked) => handleSettingChange('push', 'liveUpdates', checked)}
            />
          </SettingsSection>

          {/* Privacy Settings */}
          <SettingsSection
            title="Privacy Settings"
            description="Control who can see your information"
            icon={Shield}
          >
            <SettingItem
              label="Public Profile"
              description="Make your profile visible to everyone"
              checked={settings.privacy.profileVisible}
              onChange={(checked) => handleSettingChange('privacy', 'profileVisible', checked)}
              icon={Globe}
            />
            <SettingItem
              label="Show Activity"
              description="Display your activity history to others"
              checked={settings.privacy.showActivity}
              onChange={(checked) => handleSettingChange('privacy', 'showActivity', checked)}
              icon={Eye}
            />
            <SettingItem
              label="Show Location"
              description="Display your location on your profile"
              checked={settings.privacy.showLocation}
              onChange={(checked) => handleSettingChange('privacy', 'showLocation', checked)}
            />
            <SettingItem
              label="Allow Messages"
              description="Let other users send you direct messages"
              checked={settings.privacy.allowMessages}
              onChange={(checked) => handleSettingChange('privacy', 'allowMessages', checked)}
              icon={MessageSquare}
            />
          </SettingsSection>

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
              onClick={handleSubmit}
              variant="travel"
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
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;