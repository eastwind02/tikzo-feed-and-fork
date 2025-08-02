import { useState, useEffect } from "react";
import { User, MapPin, Settings, Heart, Bookmark, Star, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/BottomNavigation";
import { AuthGuard } from "@/components/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
    };
    
    getProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "See you later!",
        description: "You've been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const userStats = {
    dishesTried: 47,
    restaurantsExplored: 23,
    followers: 156,
    following: 89
  };

  const activityFeed = [
    { type: "rating", text: "You rated 'Hot Honey Wings' 5 stars", time: "2h ago" },
    { type: "bookmark", text: "You bookmarked 'Truffle Pasta' from Mario's", time: "5h ago" },
    { type: "follow", text: "Sara bookmarked your saved dish", time: "1d ago" },
    { type: "rating", text: "You tried 'Korean BBQ Bowl' at Seoul Kitchen", time: "2d ago" }
  ];

  const favorites = [
    { name: "Truffle Mac & Cheese", restaurant: "Bistro Downtown", image: "https://images.unsplash.com/photo-1543826173-70651703c5a4?auto=format&fit=crop&w=150&q=80" },
    { name: "Spicy Korean Tacos", restaurant: "Seoul Kitchen", image: "https://images.unsplash.com/photo-1565299585323-38174c4a6706?auto=format&fit=crop&w=150&q=80" },
    { name: "Artisan Pizza", restaurant: "Nonna's", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=150&q=80" }
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-6 pb-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <div className="flex gap-2">
              <Button variant="secondary" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20 border-4 border-white">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">
                {profile?.display_name || user?.email?.split('@')[0] || 'Food Explorer'}
              </h2>
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <MapPin className="w-4 h-4" />
                <span>New York, NY</span>
              </div>
              <p className="text-white/90 text-sm">
                {profile?.bio || "Discovering amazing food, one dish at a time 🍕"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userStats.dishesTried}</div>
              <div className="text-xs text-white/80">Dishes Tried</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userStats.restaurantsExplored}</div>
              <div className="text-xs text-white/80">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userStats.followers}</div>
              <div className="text-xs text-white/80">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userStats.following}</div>
              <div className="text-xs text-white/80">Following</div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="p-4">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-4 mt-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              {activityFeed.map((activity, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                        {activity.type === "rating" && <Star className="w-4 h-4 text-primary" />}
                        {activity.type === "bookmark" && <Bookmark className="w-4 h-4 text-primary" />}
                        {activity.type === "follow" && <Heart className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-4 mt-4">
              <h3 className="text-lg font-semibold">Your Top Dishes</h3>
              <div className="grid grid-cols-1 gap-4">
                {favorites.map((dish, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="w-16 h-16 bg-cover bg-center flex-shrink-0" 
                             style={{ backgroundImage: `url(${dish.image})` }} />
                        <div className="flex-1 p-3">
                          <h4 className="font-semibold text-sm">{dish.name}</h4>
                          <p className="text-xs text-muted-foreground">{dish.restaurant}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="friends" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Friends</h3>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Find Friends
                </Button>
              </div>
              
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h4 className="text-xl font-semibold mb-2">Connect with friends</h4>
                <p className="text-muted-foreground mb-4">
                  See what your friends are eating and share your discoveries
                </p>
                <Button>Invite Friends</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <BottomNavigation />
      </div>
    </AuthGuard>
  );
};

export default Profile;