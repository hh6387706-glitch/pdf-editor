import { Download, Upload, Cog, FolderInput } from "lucide-react";

export function ProcessSteps() {
  const steps = [
    {
      icon: Download,
      title: "Export WordPress",
      active: true
    },
    {
      icon: Upload,
      title: "Upload XML File",
      active: false
    },
    {
      icon: Cog,
      title: "Convert",
      active: false
    },
    {
      icon: FolderInput,
      title: "Import to Blogger",
      active: false
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-lg font-semibold mb-6 text-center">How it works</h2>
      <div className="flex justify-center items-center space-x-8 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                step.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{step.title}</span>
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-full w-8 h-0.5 bg-border transform -translate-y-1/2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
