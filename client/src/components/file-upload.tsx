import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, FileText, X, ArrowLeftRight, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { ConversionResult } from "@shared/schema";

export function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const convertMutation = useMutation({
    mutationFn: async (file: File): Promise<ConversionResult> => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiRequest('POST', '/api/convert', formData);
      return await response.json();
    },
    onSuccess: (result) => {
      if (result.success && result.content) {
        // Download the converted file
        const xmlContent = atob(result.content);
        const blob = new Blob([xmlContent], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Conversion Complete!",
          description: "Your Blogger XML file has been downloaded successfully.",
        });
        setShowReset(true);
      } else {
        throw new Error(result.error || 'Conversion failed');
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: error.message || "An error occurred during conversion.",
      });
    }
  });

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.xml')) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a valid XML file.",
      });
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "File size must be less than 50MB.",
      });
      return;
    }

    setSelectedFile(file);
    setShowReset(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setShowReset(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConvert = () => {
    if (selectedFile) {
      convertMutation.mutate(selectedFile);
    }
  };

  const handleReset = () => {
    handleRemoveFile();
    convertMutation.reset();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-8">
        <h3 className="text-xl font-semibold mb-6 text-center">Convert Your WordPress Export</h3>
        
        {/* File Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : selectedFile 
                ? 'border-green-300 bg-green-50' 
                : 'border-border hover:border-primary hover:bg-primary/2'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          data-testid="upload-zone"
        >
          {!selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto">
                <CloudUpload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground mb-1">Select WordPress Export File (XML)</p>
                <p className="text-muted-foreground text-sm">Click to select file or drag and drop here</p>
              </div>
              <p className="text-xs text-muted-foreground">Maximum file size: 50MB • Supported format: XML</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground" data-testid="file-name">{selectedFile.name}</p>
                <p className="text-muted-foreground text-sm" data-testid="file-size">{formatFileSize(selectedFile.size)}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                data-testid="button-remove-file"
              >
                <X className="h-4 w-4 mr-1" /> Remove file
              </Button>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".xml"
          onChange={handleFileInputChange}
          data-testid="input-file"
        />

        {/* Progress Section */}
        {convertMutation.isPending && (
          <div className="mt-6">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Converting file...</span>
                <span className="text-sm text-muted-foreground">Processing</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          </div>
        )}

        {/* Status Messages */}
        {convertMutation.isError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <span className="text-red-800">
                {convertMutation.error?.message || "Conversion failed. Please try again."}
              </span>
            </div>
          </div>
        )}

        {convertMutation.isSuccess && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-green-800">File converted successfully! Your Blogger XML file has been downloaded.</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleConvert}
            disabled={!selectedFile || convertMutation.isPending}
            className="px-8 py-3"
            data-testid="button-convert"
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Convert & Download Blogger XML
          </Button>
          {showReset && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="px-6 py-3"
              data-testid="button-reset"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
