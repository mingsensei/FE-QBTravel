import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share, MoreVertical, Volume2, VolumeX, X } from 'lucide-react';

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
  url: string;
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

interface VideoItemProps {
  video: Video;
  isActive: boolean;
  onToggleLike: (videoId: string) => void;
  onOpenComments: (video: Video) => void;
  onShare: (videoId: string) => void;
  showComments: boolean;
  onCloseComments: () => void;
}

const CommentItem: React.FC<{ comment: Comment; onLike: (commentId: string) => void }> = ({ 
  comment, 
  onLike 
}) => {
  return (
    <div className="flex space-x-3 py-3 border-b border-white/10 last:border-b-0">
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
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

const VideoItem: React.FC<VideoItemProps> = ({ 
  video, 
  isActive, 
  onToggleLike, 
  onOpenComments, 
  onShare,
  showComments,
  onCloseComments
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
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
    }
  ];

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleLikeComment = (commentId: string) => {
    console.log('Like comment:', commentId);
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      console.log('Submit comment:', commentText);
      setCommentText('');
    }
  };

  return (
    <div className="relative w-full h-screen snap-start snap-always flex">
      {/* Video Container */}
      <div className={`relative transition-all duration-500 ease-in-out ${
        showComments ? 'w-2/3' : 'w-full'
      } h-full`}>
        {/* Video Player */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover bg-black"
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlayPause}
          poster={`https://picsum.photos/400/800?random=${video.id}`}
        >
          <source src={video.url} type="video/mp4" />
          {/* Fallback for demo */}
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-lg opacity-80">Video {video.id}</p>
            </div>
          </div>
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 gradient-overlay pointer-events-none" />

        {/* Top User Info */}
        <div className="absolute top-16 left-4 flex items-center space-x-3 z-10">
          <div className="relative">
            <img
              src={video.user.avatar}
              alt={video.user.username}
              className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg"
            />
            {video.user.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-white font-semibold text-sm">@{video.user.username}</span>
              <span className="text-white/60 text-xs">•</span>
              <span className="text-white/60 text-xs">{video.timestamp}</span>
            </div>
            <span className="text-white/80 text-xs">Follow</span>
          </div>
        </div>

        {/* Video Description */}
        <div className={`absolute bottom-24 left-4 z-10 transition-all duration-500 ${
          showComments ? 'right-4' : 'right-20'
        }`}>
          <p className="text-white text-sm leading-relaxed drop-shadow-lg">
            {video.description}
          </p>
        </div>

        {/* Action Buttons */}
        {!showComments && (
          <div className="absolute right-4 bottom-24 flex flex-col space-y-6 z-10">
            {/* Like Button */}
            <div className="flex flex-col items-center space-y-1">
              <button
                onClick={() => onToggleLike(video.id)}
                className={`action-btn w-12 h-12 rounded-full btn-glass flex items-center justify-center ${
                  video.isLiked ? 'text-like' : 'text-white'
                }`}
              >
                <Heart 
                  className={`w-7 h-7 ${video.isLiked ? 'fill-current' : ''}`} 
                />
              </button>
              <span className="text-white text-xs font-medium">
                {video.likes > 999 ? `${(video.likes / 1000).toFixed(1)}k` : video.likes}
              </span>
            </div>

            {/* Comment Button */}
            <div className="flex flex-col items-center space-y-1">
              <button
                onClick={() => onOpenComments(video)}
                className="action-btn w-12 h-12 rounded-full btn-glass flex items-center justify-center text-white"
              >
                <MessageCircle className="w-7 h-7" />
              </button>
              <span className="text-white text-xs font-medium">
                {video.comments > 999 ? `${(video.comments / 1000).toFixed(1)}k` : video.comments}
              </span>
            </div>

            {/* Share Button */}
            <div className="flex flex-col items-center space-y-1">
              <button
                onClick={() => onShare(video.id)}
                className="action-btn w-12 h-12 rounded-full btn-glass flex items-center justify-center text-white"
              >
                <Share className="w-7 h-7" />
              </button>
              <span className="text-white text-xs font-medium">
                {video.shares > 999 ? `${(video.shares / 1000).toFixed(1)}k` : video.shares}
              </span>
            </div>

            {/* More Options */}
            <button className="action-btn w-12 h-12 rounded-full btn-glass flex items-center justify-center text-white">
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Volume Control */}
        <button
          onClick={toggleMute}
          className="absolute top-20 right-4 w-10 h-10 rounded-full btn-glass flex items-center justify-center text-white z-10"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Play/Pause Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Comments Panel */}
      <div className={`transition-all duration-500 ease-in-out ${
        showComments ? 'w-1/3 opacity-100' : 'w-0 opacity-0'
      } h-full overflow-hidden`}>
        <div className="h-full glass-panel flex flex-col">
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
              onClick={onCloseComments}
              className="w-8 h-8 rounded-full btn-glass flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
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
    </div>
  );
};

export const VideoFeed: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showComments, setShowComments] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock data
  const videos: Video[] = [
    {
      id: '1',
      url: '/videos/video1.mp4',
      user: {
        id: '1',
        username: 'sarah_creates',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      description: 'Amazing sunset timelapse from my rooftop! 🌅 The colors were absolutely incredible tonight. Nature never fails to inspire me ✨ #sunset #timelapse #nature',
      likes: 1247,
      comments: 89,
      shares: 23,
      timestamp: '2h',
      isLiked: false
    },
    {
      id: '2',
      url: '/videos/video2.mp4',
      user: {
        id: '2',
        username: 'chef_marco',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      description: 'Perfect pasta carbonara in 60 seconds! 🍝 The secret is in the technique. Who wants the full recipe? Drop a comment! #cooking #pasta #recipe',
      likes: 3421,
      comments: 156,
      shares: 78,
      timestamp: '4h',
      isLiked: true
    },
    {
      id: '3',
      url: '/videos/video3.mp4',
      user: {
        id: '3',
        username: 'fitness_jenny',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      description: '5-minute morning stretch routine to start your day right! 💪 Your body will thank you. Save this for tomorrow morning! #fitness #stretch #morning',
      likes: 892,
      comments: 34,
      shares: 45,
      timestamp: '6h',
      isLiked: false
    }
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const newIndex = Math.round(scrollTop / window.innerHeight);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex);
    }
  };

  const handleToggleLike = (videoId: string) => {
    console.log('Toggle like for video:', videoId);
  };

  const handleOpenComments = (video: Video) => {
    setSelectedVideo(video);
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setShowComments(false);
    setSelectedVideo(null);
  };

  const handleShare = (videoId: string) => {
    console.log('Share video:', videoId);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide bg-black"
      onScroll={handleScroll}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {videos.map((video, index) => (
        <VideoItem
          key={video.id}
          video={video}
          isActive={index === currentVideoIndex}
          onToggleLike={handleToggleLike}
          onOpenComments={handleOpenComments}
          onShare={handleShare}
          showComments={showComments && selectedVideo?.id === video.id}
          onCloseComments={handleCloseComments}
        />
      ))}
    </div>
  );
};