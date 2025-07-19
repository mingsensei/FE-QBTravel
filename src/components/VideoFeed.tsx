import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  MoreVertical,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import clsx from "clsx";

/* ========== Types ========== */
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

/* ========== Comment Item ========== */
const CommentItem: React.FC<{
  comment: Comment;
  onLike: (commentId: string) => void;
}> = ({ comment, onLike }) => (
  <div className="flex space-x-3 py-3 border-b border-white/10 last:border-b-0">
    <img
      src={comment.user.avatar}
      alt={comment.user.username}
      className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
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
          className={clsx(
            "flex items-center space-x-1 text-xs",
            comment.isLiked ? "text-like" : "text-muted-foreground"
          )}
        >
          <Heart
            className={clsx(
              "w-3 h-3",
              comment.isLiked && "fill-current"
            )}
          />
          <span>{comment.likes}</span>
        </button>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Reply
        </button>
      </div>
    </div>
  </div>
);

/* ========== Comments Panel ========== */
interface CommentsPanelProps {
  video: Video;
  comments: Comment[];
  variant: "desktop" | "mobile";
  onClose: () => void;
  onToggleLikeVideo: () => void;
  onShare: () => void;
  onLikeComment: (cid: string) => void;
}
const CommentsPanel: React.FC<CommentsPanelProps> = ({
  video,
  comments,
  variant,
  onClose,
  onToggleLikeVideo,
  onShare,
  onLikeComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const submit = () => {
    if (!commentText.trim()) return;
    console.log("Submit comment:", commentText);
    setCommentText("");
  };

  const base =
    variant === "desktop"
      ? "hidden md:flex flex-col h-full w-[360px] bg-neutral-900/70 backdrop-blur-md border-l border-white/10 panel-animate overflow-hidden" /* + */
      : "md:hidden fixed inset-x-0 bottom-0 h-[55%] z-30 flex flex-col bg-neutral-900/90 backdrop-blur-md border-t border-white/10 panel-animate overflow-hidden rounded-t-2xl" /* + */;

  return (
    <div className={base}>
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <img
            src={video.user.avatar}
            alt={video.user.username}
            className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xs md:text-sm font-semibold text-white">
              {video.comments} comments
            </h3>
            <p className="text-xs text-muted-foreground">
              @{video.user.username}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
            className="w-6 h-6 md:w-8 md:h-8 rounded-full btn-glass flex items-center justify-center text-white"
          aria-label="Close comments"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 scrollbar-hide overscroll-contain" /* + */>
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} onLike={onLikeComment} />
        ))}
      </div>

      <div className="p-3 md:p-4 border-t border-white/10">
        <div className="flex items-center space-x-2 md:space-x-3">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face"
            alt="You"
            className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 flex items-center space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 md:px-4 py-1.5 md:py-2
                         text-xs md:text-sm text-white placeholder-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <button
              onClick={submit}
              disabled={!commentText.trim()}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-primary hover:bg-primary/80 disabled:bg-white/10
                         disabled:text-muted-foreground rounded-full text-xs md:text-sm font-medium text-white transition-all"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-around p-3 md:p-4 border-t border-white/10">
        <button
          onClick={onToggleLikeVideo}
          className={clsx(
            "flex items-center space-x-2 px-3 md:px-4 py-2 rounded-full btn-glass",
            video.isLiked ? "text-like" : "text-white"
          )}
        >
          <Heart
            className={clsx(
              "w-4 h-4 md:w-5 md:h-5",
              video.isLiked && "fill-current"
            )}
          />
          <span className="text-xs md:text-sm">
            {video.likes > 999
              ? `${(video.likes / 1000).toFixed(1)}k`
              : video.likes}
          </span>
        </button>
        <button
          onClick={onShare}
          className="flex items-center space-x-2 px-3 md:px-4 py-2 rounded-full btn-glass text-white"
        >
          <Share className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-xs md:text-sm">
            {video.shares > 999
              ? `${(video.shares / 1000).toFixed(1)}k`
              : video.shares}
          </span>
        </button>
      </div>
    </div>
  );
};

/* ========== Video Item ========== */
const VideoItem: React.FC<VideoItemProps> = ({
  video,
  isActive,
  onToggleLike,
  onOpenComments,
  onShare,
  showComments,
  onCloseComments,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const comments: Comment[] = [
    {
      id: "1",
      user: {
        id: "1",
        username: "alex_photo",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      text: "This is absolutely stunning! 😍 The way the light hits the clouds is just magical",
      likes: 23,
      timestamp: "1h",
      isLiked: false,
    },
    {
      id: "2",
      user: {
        id: "2",
        username: "nature_lover",
        avatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
        verified: true,
      },
      text: "Where was this taken? I need to add this location to my bucket list! 🌅",
      likes: 8,
      timestamp: "45m",
      isLiked: true,
    },
    {
      id: "3",
      user: {
        id: "3",
        username: "photographer_mike",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
      text: "Great composition! What camera settings did you use for this? The exposure is perfect 📸",
      likes: 15,
      timestamp: "30m",
      isLiked: false,
    },
  ];

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isActive) {
      el.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const likeComment = (cid: string) => {
    console.log("Like comment:", cid);
  };

  const handleVideoTap = () => {
    togglePlayPause();
  };

  return (
    <div className="relative w-full h-screen snap-start snap-always bg-black overflow-hidden flex items-center justify-center">
      <div className="w-full h-full flex justify-center overflow-hidden" /* + */>
        <div
          className={
            "relative h-full flex items-center " +
            (showComments
              ? " md:grid md:grid-cols-[max-content_360px] md:items-center"
              : " justify-center")
          }
          style={{
            maxWidth: "calc(min(100vw,56vh + 360px))" /* + bảo vệ không vượt 100vw */,
          }}
        >
          {/* VIDEO */}
          <div className="relative h-full flex">
            <div
              className="relative h-full aspect-[9/16] max-h-full w-auto max-w-[100vw] /* + */
                         md:max-w-[min(100vw-360px,520px)] md:w-auto" /* + giới hạn khi có panel */
            >
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-auto max-w-full object-cover bg-black rounded-lg"
                loop
                muted={isMuted}
                playsInline
                onClick={handleVideoTap}
                poster={`https://picsum.photos/720/1280?random=${video.id}`}
              >
                <source src={video.url} type="video/mp4" />
              </video>

              <div className="absolute inset-0 gradient-overlay pointer-events-none rounded-lg" />

              {/* User info */}
              <div className="absolute top-4 left-4 flex items-center space-x-3 z-10">
                <div className="relative">
                  <img
                    src={video.user.avatar}
                    alt={video.user.username}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30 object-cover shadow-lg"
                  />
                  {video.user.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold text-xs md:text-sm">
                      @{video.user.username}
                    </span>
                    <span className="text-white/60 text-xs">•</span>
                    <span className="text-white/60 text-xs">
                      {video.timestamp}
                    </span>
                  </div>
                  <span className="text-white/80 text-xs">Follow</span>
                </div>
              </div>

              {/* Description */}
              <div className="absolute bottom-4 left-4 right-16 md:right-4 z-10">
                <p className="text-white text-xs md:text-sm leading-relaxed drop-shadow-lg line-clamp-[10]">
                  {video.description}
                </p>
              </div>

              {/* Action buttons */}
              <div
                className={clsx(
                  "absolute right-4 bottom-4 flex flex-col space-y-4 md:space-y-6 z-10",
                  showComments && "md:hidden"
                )}
              >
                <div className="flex flex-col items-center space-y-1">
                  <button
                    onClick={() => onToggleLike(video.id)}
                    className={clsx(
                      "action-btn w-10 h-10 md:w-12 md:h-12 rounded-full btn-glass flex items-center justify-center",
                      video.isLiked ? "text-like" : "text-white"
                    )}
                  >
                    <Heart
                      className={clsx(
                        "w-5 h-5 md:w-7 md:h-7",
                        video.isLiked && "fill-current"
                      )}
                    />
                  </button>
                  <span className="text-white text-xs font-medium">
                    {video.likes > 999
                      ? `${(video.likes / 1000).toFixed(1)}k`
                      : video.likes}
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <button
                    onClick={() => onOpenComments(video)}
                    className="action-btn w-10 h-10 md:w-12 md:h-12 rounded-full btn-glass flex items-center justify-center text-white"
                  >
                    <MessageCircle className="w-5 h-5 md:w-7 md:h-7" />
                  </button>
                  <span className="text-white text-xs font-medium">
                    {video.comments > 999
                      ? `${(video.comments / 1000).toFixed(1)}k`
                      : video.comments}
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <button
                    onClick={() => onShare(video.id)}
                    className="action-btn w-10 h-10 md:w-12 md:h-12 rounded-full btn-glass flex items-center justify-center text-white"
                  >
                    <Share className="w-5 h-5 md:w-7 md:h-7" />
                  </button>
                  <span className="text-white text-xs font-medium">
                    {video.shares > 999
                      ? `${(video.shares / 1000).toFixed(1)}k`
                      : video.shares}
                  </span>
                </div>
                <button className="action-btn w-10 h-10 md:w-12 md:h-12 rounded-full btn-glass flex items-center justify-center text-white">
                  <MoreVertical className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Volume (Desktop only) */}
              <button
                onClick={toggleMute}
                aria-label="Toggle mute"
                className="hidden md:flex absolute top-4 right-4 w-10 h-10 rounded-full btn-glass items-center justify-center text-white z-10"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              {/* Play overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[8px] md:border-l-[12px] border-l-white border-t-[6px] md:border-t-[8px] border-t-transparent border-b-[6px] md:border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {showComments && (
            <CommentsPanel
              video={video}
              comments={comments}
              variant="desktop"
              onClose={onCloseComments}
              onToggleLikeVideo={() => onToggleLike(video.id)}
              onShare={() => onShare(video.id)}
              onLikeComment={likeComment}
            />
          )}

          {showComments && (
            <CommentsPanel
              video={video}
              comments={comments}
              variant="mobile"
              onClose={onCloseComments}
              onToggleLikeVideo={() => onToggleLike(video.id)}
              onShare={() => onShare(video.id)}
              onLikeComment={likeComment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ========== Video Feed Root ========== */
export const VideoFeed: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showComments, setShowComments] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const videos: Video[] = [
    {
      id: "1",
      url: "/videos/video1.mp4",
      user: {
        id: "1",
        username: "sarah_creates",
        avatar:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=face",
        verified: true,
      },
      description:
        "Amazing sunset timelapse from my rooftop! 🌅 The colors were absolutely incredible tonight. Nature never fails to inspire me ✨ #sunset #timelapse #nature",
      likes: 1247,
      comments: 89,
      shares: 23,
      timestamp: "2h",
      isLiked: false,
    },
    {
      id: "2",
      url: "/videos/video2.mp4",
      user: {
        id: "2",
        username: "chef_marco",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      },
      description:
        "Perfect pasta carbonara in 60 seconds! 🍝 The secret is in the technique. Who wants the full recipe? Drop a comment! #cooking #pasta #recipe",
      likes: 3421,
      comments: 156,
      shares: 78,
      timestamp: "4h",
      isLiked: true,
    },
    {
      id: "3",
      url: "/videos/video3.mp4",
      user: {
        id: "3",
        username: "fitness_jenny",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
        verified: true,
      },
      description:
        "5-minute morning stretch routine to start your day right! 💪 Save this for tomorrow morning! #fitness #stretch #morning",
      likes: 892,
      comments: 34,
      shares: 45,
      timestamp: "6h",
      isLiked: false,
    },
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const newIndex = Math.round(scrollTop / window.innerHeight);
    if (
      newIndex !== currentVideoIndex &&
      newIndex >= 0 &&
      newIndex < videos.length
    ) {
      if (showComments) {
        setShowComments(false);
        setSelectedVideo(null);
      }
      setCurrentVideoIndex(newIndex);
    }
  };

  const handleToggleLike = (videoId: string) => {
    console.log("Toggle like video:", videoId);
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
    console.log("Share video:", videoId);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide bg-black overscroll-y-none overflow-x-hidden" /* + */
      onScroll={handleScroll}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
