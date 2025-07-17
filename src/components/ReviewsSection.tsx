import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, User, Edit3 } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    comment: ''
  });

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && setNewReview(prev => ({ ...prev, rating: star }))}
          />
        ))}
      </div>
    );
  };

  const handleSubmitReview = () => {
    // Handle review submission
    console.log('New review:', newReview);
    setIsWriteReviewOpen(false);
    setNewReview({ author: '', rating: 5, comment: '' });
  };

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-green-50 to-green-100/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
            Visitor Reviews
          </h2>
          <Dialog open={isWriteReviewOpen} onOpenChange={setIsWriteReviewOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Edit3 className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Write Your Review</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <Input
                    value={newReview.author}
                    onChange={(e) => setNewReview(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  {renderStars(newReview.rating, true)}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Review</label>
                  <Textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience..."
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsWriteReviewOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitReview} className="bg-primary hover:bg-primary/90">
                    Submit Review
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{review.author}</h4>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="mb-3">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}