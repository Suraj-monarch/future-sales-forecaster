import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

const History = () => {
  const predictions = [
    {
      id: 1,
      date: "2024-11-15",
      product: "Wireless Headphones",
      predicted: 24580,
      actual: 25200,
      accuracy: 97.5,
      trend: "up",
    },
    {
      id: 2,
      date: "2024-11-10",
      product: "Smart Watch Pro",
      predicted: 18900,
      actual: 18450,
      accuracy: 97.6,
      trend: "down",
    },
    {
      id: 3,
      date: "2024-11-05",
      product: "Gaming Laptop",
      predicted: 42100,
      actual: 42100,
      accuracy: 100,
      trend: "neutral",
    },
    {
      id: 4,
      date: "2024-10-28",
      product: "Bluetooth Speaker",
      predicted: 15600,
      actual: 16200,
      accuracy: 96.3,
      trend: "up",
    },
    {
      id: 5,
      date: "2024-10-20",
      product: "Fitness Tracker",
      predicted: 12400,
      actual: 11800,
      accuracy: 95.2,
      trend: "down",
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4" />;
      case "down":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Prediction History</h1>
          <p className="text-muted-foreground">
            Track the accuracy of past predictions and analyze performance
          </p>
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Accuracy</p>
              <p className="text-3xl font-bold">97.3%</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-muted-foreground">Total Predictions</p>
              <p className="text-2xl font-bold">248</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {predictions.map((prediction) => (
            <Card key={prediction.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{prediction.product}</h3>
                    <Badge variant="secondary">{prediction.date}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Predicted Sales</p>
                      <p className="text-xl font-semibold">
                        ${prediction.predicted.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Actual Sales</p>
                      <p className="text-xl font-semibold">
                        ${prediction.actual.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-semibold">{prediction.accuracy}%</p>
                        <div className={getTrendColor(prediction.trend)}>
                          {getTrendIcon(prediction.trend)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge variant={prediction.accuracy >= 95 ? "default" : "secondary"}>
                    {prediction.accuracy >= 95 ? "High Accuracy" : "Good"}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
