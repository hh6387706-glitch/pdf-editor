import { Card } from "@/components/ui/card";
import { ProcessSteps } from "@/components/process-steps";
import { InstructionsCard } from "@/components/instructions-card";
import { FileUpload } from "@/components/file-upload";
import { FeaturesGrid } from "@/components/features-grid";
import { ArrowLeftRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ArrowLeftRight className="text-primary-foreground h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">WordPress to Blogger XML Converter</h1>
              <p className="text-muted-foreground text-sm">Convert your WordPress export file to Blogger XML format</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ProcessSteps />
        <InstructionsCard />
        <FileUpload />
        <FeaturesGrid />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground text-sm">&copy; 2024 WordPress to Blogger Converter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
