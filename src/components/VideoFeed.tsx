import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share, MoreVertical, Volume2, VolumeX } from 'lucide-react';
import { CommentSheet } from './CommentSheet';

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
}

const VideoItem: React.FC<VideoItemProps> = ({ 
  video, 
  isActive, 
  onToggleLike, 
  onOpenComments, 
  onShare 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <div className="relative w-full h-screen snap-start snap-always">
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
        {/* Fallback for demo - using a placeholder */}
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
      <div className="absolute bottom-24 left-4 right-20 z-10">
        <p className="text-white text-sm leading-relaxed drop-shadow-lg">
          {video.description}
        </p>
      </div>

      {/* Action Buttons */}
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
  );
};

export const VideoFeed: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with real data
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
    // In a real app, this would update the backend
    console.log('Toggle like for video:', videoId);
  };

  const handleOpenComments = (video: Video) => {
    setSelectedVideo(video);
    setIsCommentsOpen(true);
  };

  const handleShare = (videoId: string) => {
    // In a real app, this would open native share dialog
    console.log('Share video:', videoId);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide"
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
          />
        ))}
      </div>

      {/* Comments Sheet */}
      {selectedVideo && (
        <CommentSheet
          video={selectedVideo}
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
        />
      )}
    </>
  );
};