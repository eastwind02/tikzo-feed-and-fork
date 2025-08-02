import { useState, useRef, useEffect } from "react";
import { Heart, Share, MessageCircle, ShoppingCart, Bookmark, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Dish {
  id: string;
  name: string;
  price: number;
  restaurant_name: string;
  restaurant_address: string;
  distance: number;
  rating: number;
  video_url: string;
  image_url: string;
  tags: string[];
  description: string;
}

interface VideoFeedProps {
  dishes: Dish[];
  onLike: (dishId: string) => void;
  onBookmark: (dishId: string) => void;
  onShare: (dishId: string) => void;
  onOrder: (dishId: string) => void;
}

const VideoFeedItem = ({ dish, onLike, onBookmark, onShare, onOrder }: { 
  dish: Dish; 
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onShare: (id: string) => void;
  onOrder: (id: string) => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(dish.id);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark(dish.id);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
        onClick={togglePlay}
        poster={dish.image_url}
      >
        <source src={dish.video_url} type="video/mp4" />
        {/* Fallback image if video fails */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dish.image_url})` }} />
      </video>

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent z-10" />

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-4">
        {/* Top Content */}
        <div className="flex justify-between items-start pt-12">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/30 rounded-full px-3 py-1 backdrop-blur-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm font-medium">{dish.rating}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 rounded-full px-3 py-1 backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-white" />
              <span className="text-white text-sm">{dish.distance}km</span>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="flex items-end justify-between">
          {/* Left Content */}
          <div className="flex-1 pr-4">
            <h2 className="text-white text-2xl font-bold mb-2">{dish.name}</h2>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white text-lg font-semibold">${dish.price}</span>
              <span className="text-white/80">•</span>
              <span className="text-white/80">{dish.restaurant_name}</span>
            </div>
            <p className="text-white/90 text-sm mb-3 line-clamp-2">{dish.restaurant_address}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {dish.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Order Button */}
            <Button 
              onClick={() => onOrder(dish.id)}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-8 py-3 rounded-full"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Order Now
            </Button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className={`w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 ${
                isLiked ? 'text-red-500' : 'text-white'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShare(dish.id)}
              className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
            >
              <Share className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className={`w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 ${
                isBookmarked ? 'text-yellow-500' : 'text-white'
              }`}
            >
              <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoFeed = ({ dishes, onLike, onBookmark, onShare, onOrder }: VideoFeedProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeUp = () => {
    setCurrentIndex((prev) => (prev + 1) % dishes.length);
  };

  const handleSwipeDown = () => {
    setCurrentIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") handleSwipeDown();
      if (e.key === "ArrowDown") handleSwipeUp();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (dishes.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No dishes found</h2>
          <p className="text-muted-foreground">Check back later for delicious discoveries!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <VideoFeedItem
        dish={dishes[currentIndex]}
        onLike={onLike}
        onBookmark={onBookmark}
        onShare={onShare}
        onOrder={onOrder}
      />
      
      {/* Swipe Indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30">
        <div className="flex flex-col gap-1">
          {dishes.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Swipe Areas */}
      <div 
        className="absolute top-0 left-0 right-0 h-1/2 z-25 cursor-pointer"
        onClick={handleSwipeDown}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/2 z-25 cursor-pointer"
        onClick={handleSwipeUp}
      />
    </div>
  );
};