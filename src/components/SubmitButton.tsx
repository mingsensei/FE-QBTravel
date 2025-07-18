import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
  title: string;
  images: File[];
  video: File | null;
}

/**
 * SubmitButton Component
 * Elegant submit button with validation and loading states
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  disabled = false,
  loading = false,
  title,
  images,
  video
}) => {
  // Check if form has content
  const hasContent = title.trim() !== '' || images.length > 0 || video !== null;
  const isDisabled = disabled || loading || !hasContent;

  return (
    <div className="space-y-4">
      {/* Content Summary */}
      <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <span>Title:</span>
          <span className={title.trim() ? 'text-primary font-medium' : 'text-muted-foreground'}>
            {title.trim() ? '✓' : '—'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Images:</span>
          <span className={images.length > 0 ? 'text-primary font-medium' : 'text-muted-foreground'}>
            {images.length > 0 ? images.length : '—'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Video:</span>
          <span className={video ? 'text-primary font-medium' : 'text-muted-foreground'}>
            {video ? '✓' : '—'}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={onSubmit}
        disabled={isDisabled}
        size="lg"
        className={`
          w-full h-14 text-lg font-semibold transition-all duration-300
          bg-gradient-primary hover:shadow-glow hover:scale-[1.02]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${!isDisabled ? 'shadow-primary' : ''}
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            {hasContent ? 'Publish Post' : 'Add Content to Publish'}
          </>
        )}
      </Button>

      {/* Help Text */}
      {!hasContent && (
        <p className="text-center text-sm text-muted-foreground">
          Add a title, images, or video to enable publishing
        </p>
      )}
    </div>
  );
};