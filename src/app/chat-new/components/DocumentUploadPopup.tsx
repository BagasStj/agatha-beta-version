import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface DocumentUploadPopupProps {
  onUploadSuccess: (text: string) => void;
}

const DocumentUploadPopup: React.FC<DocumentUploadPopupProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onUploadSuccess(result.text);
      toast({
        title: "Upload successful",
        description: "Your document has been processed and added to the AI's knowledge.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading your document.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Upload Knowledge Document</DialogTitle>
      </DialogHeader>
      <Card
        className="mt-4 border-dashed border-2 border-gray-300 rounded-lg"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center p-6">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-center"
          >
            <div className="text-4xl mb-2">📄</div>
            <p className="text-sm text-gray-600 mb-2">
              {file ? file.name : "Drag & drop your PDF here or click to select"}
            </p>
            <Button variant="outline" size="sm">
              Select File
            </Button>
          </label>
        </CardContent>
      </Card>
      <Button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full mt-4"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload and Process"
        )}
      </Button>
    </>
  );
};

export default DocumentUploadPopup;