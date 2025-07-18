import React, { useState } from 'react';
import { TitleInput } from '@/components/TitleInput';
import { ImageUploader } from '@/components/ImageUploader';
import { VideoUploader } from '@/components/VideoUploader';
import { PreviewGallery } from '@/components/PreviewGallery';
import { SubmitButton } from '@/components/SubmitButton';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Standalone nature-inspired upload form
 */
export const UploadForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [video, setVideo] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast({
                title: "Post Published Successfully! 🌿",
                description: `Your post "${title || 'Untitled'}" has been shared with the world.`,
            });
            setTitle('');
            setImages([]);
            setVideo(null);
        } catch (error) {
            toast({
                title: "Upload Failed",
                description: "There was an error publishing your post. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-subtle pt-20 pb-20">
            <div className="w-full max-w-4xl px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-6 bg-gradient-card shadow-soft border-border">
                            <div className="flex items-center space-x-2 mb-6">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold text-foreground">
                                    Create New Post
                                </h2>
                            </div>

                            <div className="space-y-8">
                                {/* Title Input */}
                                <TitleInput
                                    value={title}
                                    onChange={setTitle}
                                    placeholder="Share your nature story..."
                                />

                                <Separator className="bg-border" />

                                {/* Image Upload */}
                                <ImageUploader
                                    images={images}
                                    onImagesChange={setImages}
                                    maxImages={8}
                                />

                                <Separator className="bg-border" />

                                {/* Video Upload */}
                                <VideoUploader
                                    video={video}
                                    onVideoChange={setVideo}
                                    maxSizeMB={50}
                                />

                                <Separator className="bg-border" />

                                {/* Submit Button */}
                                <SubmitButton
                                    onSubmit={handleSubmit}
                                    loading={isSubmitting}
                                    title={title}
                                    images={images}
                                    video={video}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <PreviewGallery
                                title={title}
                                images={images}
                                video={video}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>


);
};
