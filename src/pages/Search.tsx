import { useState } from "react";
import { Search as SearchIcon, Filter, Utensils, Leaf, Flame, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { AuthGuard } from "@/components/AuthGuard";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterCategories = [
    { id: "cuisine", label: "Cuisine", icon: Utensils },
    { id: "dietary", label: "Dietary", icon: Leaf },
    { id: "spice", label: "Spicy", icon: Flame },
    { id: "price", label: "Price", icon: DollarSign },
  ];

  const trendingTags = [
    "Cheesy", "Healthy", "Spicy", "Vegan", "Comfort Food", "Street Food",
    "Italian", "Mexican", "Asian", "BBQ", "Dessert", "Fresh"
  ];

  const searchHistory = [
    "Korean BBQ",
    "Vegan burgers", 
    "Spicy tacos",
    "Sushi near me"
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find food, mood, or restaurant..."
              className="pl-10 pr-12 h-12 text-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Filter Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Filters</h3>
            <div className="grid grid-cols-2 gap-3">
              {filterCategories.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={selectedFilters.includes(id) ? "default" : "outline"}
                  onClick={() => toggleFilter(id)}
                  className="h-12 justify-start gap-3"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Trending Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Trending</h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Search History */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Searches</h3>
            <div className="space-y-2">
              {searchHistory.map((query, index) => (
                <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <SearchIcon className="w-4 h-4 text-muted-foreground" />
                      <span onClick={() => setSearchQuery(query)}>{query}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Search Results Placeholder */}
          {searchQuery && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Results for "{searchQuery}"</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h4 className="text-xl font-semibold mb-2">Coming Soon!</h4>
                <p className="text-muted-foreground">
                  Search results will appear here once we have restaurant data
                </p>
              </div>
            </div>
          )}
        </div>

        <BottomNavigation />
      </div>
    </AuthGuard>
  );
};

export default Search;