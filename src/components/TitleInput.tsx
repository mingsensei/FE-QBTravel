import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * TitleInput Component
 * Elegant input field for the media post title with nature-inspired styling
 */
export const TitleInput: React.FC<TitleInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your title..."
}) => {
  return (
    <div className="space-y-3">
      <Label 
        htmlFor="title" 
        className="text-lg font-semibold text-foreground"
      >
        Title
      </Label>
      <Input
        id="title"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 text-lg bg-gradient-card border-border focus:border-primary focus:ring-primary/20 transition-smooth rounded-xl shadow-soft"
      />
    </div>
  );
};