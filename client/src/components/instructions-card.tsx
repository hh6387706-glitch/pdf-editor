import { Card, CardContent } from "@/components/ui/card";
import { Info, Lightbulb } from "lucide-react";

export function InstructionsCard() {
  const instructions = [
    {
      step: 1,
      title: "Export your WordPress content:",
      description: "Go to Tools → Export in your WordPress admin panel"
    },
    {
      step: 2,
      title: "Upload the XML file:",
      description: "Use the file selector or drag and drop your WordPress export file below"
    },
    {
      step: 3,
      title: "Download converted file:",
      description: "The Blogger XML file will download automatically"
    },
    {
      step: 4,
      title: "Import to Blogger:",
      description: "Go to Settings → Import content in your Blogger dashboard"
    }
  ];

  return (
    <Card className="mb-8 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Info className="text-primary mr-3 h-5 w-5" />
          Instructions
        </h3>
        <div className="space-y-3 text-muted-foreground">
          {instructions.map((instruction) => (
            <div key={instruction.step} className="flex items-start space-x-3">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full text-sm flex items-center justify-center font-medium mt-0.5 flex-shrink-0">
                {instruction.step}
              </span>
              <p>
                <strong className="text-foreground">{instruction.title}</strong> {instruction.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-accent rounded-lg">
          <p className="text-sm text-accent-foreground">
            <Lightbulb className="inline h-4 w-4 text-yellow-500 mr-2" />
            <strong>Note:</strong> This converter handles posts, pages, categories (as labels), and basic content formatting. Custom fields and advanced features may require manual adjustment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
