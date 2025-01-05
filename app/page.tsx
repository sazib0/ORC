"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UploadArea } from "@/components/ocr/upload-area";
import { ResultDisplay } from "@/components/ocr/result-display";
import { processImageWithOCR } from "@/lib/ocr";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const processImage = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setProgress(20);
      
      const extractedText = await processImageWithOCR(file);
      setProgress(80);
      setResult(extractedText);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "An error occurred while processing the image");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">OCR Text Extractor</h1>
          <p className="text-lg text-gray-600">
            Upload an image and extract text using advanced OCR technology
          </p>
        </div>

        <Card className="p-6 bg-white shadow-lg">
          <div className="space-y-6">
            <UploadArea onFileSelect={handleFileSelect} selectedFile={file} />

            <div className="flex justify-center">
              <Button
                onClick={processImage}
                disabled={!file || loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Processing..." : "Extract Text"}
              </Button>
            </div>

            {loading && (
              <Progress value={progress} className="w-full h-2" />
            )}

            <ResultDisplay result={result} />
          </div>
        </Card>
      </div>
    </main>
  );
}