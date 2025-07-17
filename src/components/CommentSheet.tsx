import React, { useState } from 'react';
import { X, Heart, Reply, MoreHorizontal } from 'lucide-react';

interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  text: string;
  likes: number;
  timestamp: string;
  isLiked?: boolean;
  replies?: Comment[];
}

interface Video {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  description: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked?: boolean;
}

interface CommentSheetProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
}

const CommentItem: React.FC<{ comment: Comment; onLike: (commentId: string) => void }> = ({ 
  comment, 
  onLike 
}) => {
  return (
    <div className="flex space-x-3 py-3">
      <img
        src={comment.user.avatar}
        alt={comment.user.username}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-semibold text-white">
            {comment.user.username}
          </span>
          {comment.user.verified && (
            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {comment.timestamp}
          </span>
        </div>
        <p className="text-sm text-foreground leading-relaxed mb-2">
          {comment.text}
        </p>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike(comment.id)}
            className={`flex items-center space-x-1 text-xs ${
              comment.isLiked ? 'text-like' : 'text-muted-foreground'
            }`}
          >
            <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
            <span>{comment.likes}</span>
          </button>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Reply className="w-3 h-3 inline mr-1" />
            Reply
          </button>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            <MoreHorizontal className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const CommentSheet: React.FC<CommentSheetProps> = ({ 
  video, 
  isOpen, 
  onClose 
}) => {
  const [commentText, setCommentText] = useState('');

  // Mock comments data
  const comments: Comment[] = [
    {
      id: '1',
      user: {
        id: '1',
        username: 'alex_photo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      text: 'This is absolutely stunning! 😍 The way the light hits the clouds is just magical',
      likes: 23,
      timestamp: '1h',
      isLiked: false
    },
    {
      id: '2',
      user: {
        id: '2',
        username: 'nature_lover',
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      text: 'Where was this taken? I need to add this location to my bucket list! 🌅',
      likes: 8,
      timestamp: '45m',
      isLiked: true
    },
    {
      id: '3',
      user: {
        id: '3',
        username: 'photographer_mike',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      text: 'Great composition! What camera settings did you use for this? The exposure is perfect 📸',
      likes: 15,
      timestamp: '30m',
      isLiked: false
    },
    {
      id: '4',
      user: {
        id: '4',
        username: 'emma_travels',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      text: 'Making me miss golden hour so much! Can\'t wait for my next photo adventure ✨',
      likes: 5,
      timestamp: '15m',
      isLiked: false
    }
  ];

  const handleLikeComment = (commentId: string) => {
    // In a real app, this would update the backend
    console.log('Like comment:', commentId);
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      // In a real app, this would submit to backend
      console.log('Submit comment:', commentText);
      setCommentText('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Comment Sheet */}
      <div className="relative mt-auto glass-panel rounded-t-3xl max-h-[80vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <img
              src={video.user.avatar}
              alt={video.user.username}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <h3 className="text-sm font-semibold text-white">
                {video.comments} comments
              </h3>
              <p className="text-xs text-muted-foreground">
                @{video.user.username}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full btn-glass flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={handleLikeComment}
            />
          ))}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
              alt="You"
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-muted/20 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
              />
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-primary hover:bg-primary/80 disabled:bg-muted/20 disabled:text-muted-foreground rounded-full text-sm font-medium text-white transition-all duration-200"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};