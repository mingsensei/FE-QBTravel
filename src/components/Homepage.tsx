import React, { useState } from 'react';
import { Play, Heart, MessageCircle, Share2, X, ChevronLeft, ChevronRight, MapPin, Star, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { VideoFeed } from './VideoFeed';

const Homepage = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showVideoFeed, setShowVideoFeed] = useState(false);

  const famousPlaces = [
    {
      id: 1,
      name: "Phong Nha Cave",
      description: "UNESCO World Heritage underground wonder",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop&crop=entropy",
      rating: 4.8
    },
    {
      id: 2,
      name: "Paradise Cave",
      description: "Magnificent limestone cave system",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=entropy",
      rating: 4.9
    },
    {
      id: 3,
      name: "Nhat Le Beach",
      description: "Pristine white sand coastal paradise",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=entropy",
      rating: 4.7
    },
    {
      id: 4,
      name: "Botanic Garden",
      description: "Lush tropical botanical sanctuary",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=entropy",
      rating: 4.6
    },
    {
      id: 5,
      name: "Dark Cave",
      description: "Adventure cave with mud therapy",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop&crop=entropy",
      rating: 4.5
    },
    {
      id: 6,
      name: "Quang Binh National Park",
      description: "Biodiverse protected wilderness area",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&crop=entropy",
      rating: 4.8
    }
  ];

  const travelVideos = [
    {
      id: 1,
      title: "Exploring Phong Nha Caves",
      thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=400&fit=crop&crop=entropy",
      duration: "2:45",
      likes: 1234,
      comments: 89,
      author: "Travel Vietnam"
    },
    {
      id: 2,
      title: "Paradise Cave Adventure",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop&crop=entropy",
      duration: "3:20",
      likes: 2156,
      comments: 142,
      author: "Cave Explorer"
    },
    {
      id: 3,
      title: "Nhat Le Beach Sunset",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=400&fit=crop&crop=entropy",
      duration: "1:30",
      likes: 987,
      comments: 56,
      author: "Coastal Views"
    },
    {
      id: 4,
      title: "Jungle Trekking Guide",
      thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=400&fit=crop&crop=entropy",
      duration: "4:15",
      likes: 1876,
      comments: 203,
      author: "Adventure Seeker"
    },
    {
      id: 5,
      title: "Dark Cave Mud Bath",
      thumbnail: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=400&fit=crop&crop=entropy",
      duration: "2:10",
      likes: 756,
      comments: 91,
      author: "Wellness Travel"
    }
  ];

  const openVideoFeed = () => {
    setShowVideoFeed(true);
  };

  const closeVideoFeed = () => {
    setShowVideoFeed(false);
  };

  if (showVideoFeed) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <button
          onClick={closeVideoFeed}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <VideoFeed />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop&crop=entropy')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover the Magic of
            <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Quang Binh
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            UNESCO World Heritage caves, pristine beaches, and untouched wilderness await your exploration
          </p>
          <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            Discover Now
          </Button>
        </div>
      </section>

      {/* Famous Places Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Must-Visit Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the most breathtaking attractions that make Quang Binh a world-class destination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {famousPlaces.map((place) => (
              <div key={place.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src={place.image} 
                    alt={place.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{place.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{place.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-200 text-sm">{place.description}</p>
                    <div className="flex items-center mt-2">
                      <MapPin className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-xs text-green-400">Quang Binh</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Stories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Video Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch inspiring travel videos and immerse yourself in the beauty of Quang Binh
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {travelVideos.map((video, index) => (
              <div 
                key={video.id}
                className="group cursor-pointer"
                onClick={openVideoFeed}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h4 className="text-sm font-semibold mb-1 line-clamp-2">{video.title}</h4>
                    <p className="text-xs text-gray-300">{video.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={openVideoFeed}
              className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Watch More Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;