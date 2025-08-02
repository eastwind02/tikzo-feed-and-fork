import { useState } from "react";
import { Clock, CheckCircle, Truck, MapPin, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BottomNavigation from "@/components/BottomNavigation";
import { AuthGuard } from "@/components/AuthGuard";

// Mock current order
const currentOrder = {
  id: "ORDER_001",
  status: "preparing",
  progress: 60,
  estimatedTime: "15-20 min",
  restaurant: "Bistro Downtown",
  address: "123 Main St, Downtown",
  items: [
    { name: "Truffle Mac & Cheese", quantity: 1, price: 24.99 },
    { name: "Caesar Salad", quantity: 1, price: 12.99 }
  ],
  total: 37.98,
  orderTime: "2:30 PM"
};

// Mock past orders
const pastOrders = [
  {
    id: "ORDER_002",
    date: "Today, 12:30 PM",
    restaurant: "Seoul Kitchen",
    items: ["Spicy Korean Tacos", "Kimchi Fried Rice"],
    total: 28.50,
    status: "delivered"
  },
  {
    id: "ORDER_003", 
    date: "Yesterday, 7:45 PM",
    restaurant: "Nonna's Pizzeria",
    items: ["Margherita Pizza", "Garlic Bread"],
    total: 25.99,
    status: "delivered"
  },
  {
    id: "ORDER_004",
    date: "Dec 28, 6:20 PM", 
    restaurant: "Sushi Zen",
    items: ["Dragon Roll", "Miso Soup", "Edamame"],
    total: 42.75,
    status: "delivered"
  }
];

const Orders = () => {
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "preparing":
        return <Clock className="w-5 h-5 text-orange-500" />;
      case "out_for_delivery":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "preparing":
        return "Being prepared";
      case "out_for_delivery":
        return "Out for delivery";
      case "delivered":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4">
          <h1 className="text-2xl font-bold mb-4">Orders</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === "current" ? "default" : "ghost"}
              onClick={() => setActiveTab("current")}
              className="flex-1"
            >
              Current
            </Button>
            <Button
              variant={activeTab === "past" ? "default" : "ghost"}
              onClick={() => setActiveTab("past")}
              className="flex-1"
            >
              Past Orders
            </Button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === "current" ? (
            /* Current Order */
            currentOrder ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order #{currentOrder.id}</CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-2">
                      {getStatusIcon(currentOrder.status)}
                      {getStatusText(currentOrder.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Tracker */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Order Progress</span>
                      <span className="font-medium">ETA: {currentOrder.estimatedTime}</span>
                    </div>
                    <Progress value={currentOrder.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Confirmed</span>
                      <span>Preparing</span>
                      <span>Out for delivery</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{currentOrder.restaurant}</h3>
                      <p className="text-sm text-muted-foreground">{currentOrder.address}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h4 className="font-semibold mb-2">Items</h4>
                    <div className="space-y-2">
                      {currentOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${item.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${currentOrder.total}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      Track Order
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Contact Restaurant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">No current orders</h3>
                <p className="text-muted-foreground mb-4">
                  When you place an order, you'll see its progress here
                </p>
                <Button>Browse Feed</Button>
              </div>
            )
          ) : (
            /* Past Orders */
            <div className="space-y-4">
              {pastOrders.map((order) => (
                <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{order.restaurant}</h3>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total}</p>
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Delivered
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      {order.items.join(", ")}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Repeat className="w-4 h-4 mr-2" />
                        Reorder
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
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

export default Orders;