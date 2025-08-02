import { useState } from "react";
import { Heart, Clock, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { AuthGuard } from "@/components/AuthGuard";

// Mock bookmarked dishes
const mockBookmarks = [
  {
    id: "1",
    name: "Truffle Mac & Cheese",
    price: 24.99,
    restaurant_name: "Bistro Downtown",
    distance: 0.8,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1543826173-70651703c5a4?auto=format&fit=crop&w=300&q=80",
    tags: ["Cheesy", "Comfort Food"],
    saved_at: "2 hours ago"
  },
  {
    id: "2",
    name: "Spicy Korean Tacos",
    price: 16.50,
    restaurant_name: "Seoul Kitchen", 
    distance: 1.2,
    rating: 4.6,
    image_url: "https://images.unsplash.com/photo-1565299585323-38174c4a6706?auto=format&fit=crop&w=300&q=80",
    tags: ["Spicy", "Korean"],
    saved_at: "1 day ago"
  },
  {
    id: "3",
    name: "Artisan Pizza Margherita",
    price: 19.99,
    restaurant_name: "Nonna's Pizzeria",
    distance: 2.1,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80",
    tags: ["Italian", "Fresh"],
    saved_at: "3 days ago"
  }
];

const Bookmarks = () => {
  const [sortBy, setSortBy] = useState<"recent" | "liked">("recent");
  const [bookmarks] = useState(mockBookmarks);

  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    if (sortBy === "liked") {
      return b.rating - a.rating;
    }
    return 0; // Keep original order for "recent"
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Saved Dishes</h1>
              <p className="text-muted-foreground">Here's every dish your eyes—and appetite—loved.</p>
            </div>
            <Heart className="w-6 h-6 text-primary" />
          </div>
          
          {/* Sort Options */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("recent")}
            >
              <Clock className="w-4 h-4 mr-2" />
              Recently Added
            </Button>
            <Button
              variant={sortBy === "liked" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("liked")}
            >
              <Star className="w-4 h-4 mr-2" />
              Most Liked
            </Button>
          </div>
        </div>

        <div className="p-4">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔖</div>
              <h3 className="text-xl font-semibold mb-2">No saved dishes yet</h3>
              <p className="text-muted-foreground mb-4">
                Start bookmarking dishes you love while browsing the feed
              </p>
              <Button>Browse Feed</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sortedBookmarks.map((dish) => (
                <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Image */}
                      <div className="w-24 h-24 bg-cover bg-center flex-shrink-0" 
                           style={{ backgroundImage: `url(${dish.image_url})` }} />
                      
                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg leading-tight">{dish.name}</h3>
                            <p className="text-muted-foreground text-sm">{dish.restaurant_name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${dish.price}</p>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span>{dish.rating}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {dish.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {dish.distance}km
                            </div>
                            <span>{dish.saved_at}</span>
                          </div>
                        </div>
                        
                        <Button className="w-full mt-3" size="sm">
                          Order Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <BottomNavigation />
      </div>
    </AuthGuard>
  );
};

export default Bookmarks;