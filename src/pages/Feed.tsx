import { useState, useEffect } from "react";
import { VideoFeed } from "@/components/VideoFeed";
import { AuthGuard } from "@/components/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Mock data for development - replace with real data from Supabase
const mockDishes = [
  {
    id: "1",
    name: "Truffle Mac & Cheese",
    price: 24.99,
    restaurant_name: "Bistro Downtown",
    restaurant_address: "123 Main St, Downtown",
    distance: 0.8,
    rating: 4.8,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    image_url: "https://images.unsplash.com/photo-1543826173-70651703c5a4?auto=format&fit=crop&w=500&q=80",
    tags: ["Cheesy", "Comfort Food", "Truffle"],
    description: "Creamy mac and cheese elevated with black truffle shavings"
  },
  {
    id: "2", 
    name: "Spicy Korean Tacos",
    price: 16.50,
    restaurant_name: "Seoul Kitchen",
    restaurant_address: "456 Food Ave, Midtown",
    distance: 1.2,
    rating: 4.6,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    image_url: "https://images.unsplash.com/photo-1565299585323-38174c4a6706?auto=format&fit=crop&w=500&q=80",
    tags: ["Spicy", "Korean", "Fusion"],
    description: "Korean-style beef tacos with kimchi and gochujang sauce"
  },
  {
    id: "3",
    name: "Artisan Pizza Margherita", 
    price: 19.99,
    restaurant_name: "Nonna's Pizzeria",
    restaurant_address: "789 Italian Way, Little Italy",
    distance: 2.1,
    rating: 4.9,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80",
    tags: ["Italian", "Fresh", "Classic"],
    description: "Wood-fired pizza with San Marzano tomatoes and fresh mozzarella"
  }
];

const Feed = () => {
  const [dishes, setDishes] = useState(mockDishes);

  const handleLike = async (dishId: string) => {
    try {
      const { error } = await supabase
        .from('likes')
        .insert({ dish_id: dishId });
      
      if (error) throw error;
      
      toast({
        title: "❤️ Liked!",
        description: "Added to your favorites",
      });
    } catch (error: any) {
      console.error('Error liking dish:', error);
    }
  };

  const handleBookmark = async (dishId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .insert({ dish_id: dishId });
      
      if (error) throw error;
      
      toast({
        title: "🔖 Saved!",
        description: "Added to your bookmarks",
      });
    } catch (error: any) {
      console.error('Error bookmarking dish:', error);
    }
  };

  const handleShare = (dishId: string) => {
    const dish = dishes.find(d => d.id === dishId);
    if (dish && navigator.share) {
      navigator.share({
        title: `Check out ${dish.name} on Tikzo!`,
        text: `${dish.name} at ${dish.restaurant_name} - only $${dish.price}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "📋 Copied!",
        description: "Link copied to clipboard",
      });
    }
  };

  const handleOrder = (dishId: string) => {
    const dish = dishes.find(d => d.id === dishId);
    toast({
      title: "🛒 Added to Cart!",
      description: `${dish?.name} is ready to order`,
    });
    // Navigate to order flow
  };

  return (
    <AuthGuard>
      <div className="h-screen overflow-hidden">
        <VideoFeed
          dishes={dishes}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onShare={handleShare}
          onOrder={handleOrder}
        />
      </div>
    </AuthGuard>
  );
};

export default Feed;