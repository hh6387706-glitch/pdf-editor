import { Shield, Rocket, Sparkles } from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "All processing happens on our server. Your files are processed securely and not stored permanently.",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Rocket,
      title: "Fast Conversion",
      description: "Convert your WordPress export to Blogger format in seconds, not minutes.",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Sparkles,
      title: "Format Preservation",
      description: "Maintains your content structure, formatting, and metadata during conversion.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="mt-12 grid md:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="text-center p-6">
            <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
              <Icon className={`h-6 w-6 ${feature.iconColor}`} />
            </div>
            <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
            <p className="text-muted-foreground text-sm">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}
