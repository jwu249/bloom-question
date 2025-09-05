import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  file: File;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  id: string;
}

interface FileUploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export const FileUploadZone = ({ files, onFilesChange }: FileUploadZoneProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const acceptedTypes = ['.pdf', '.docx', '.txt', '.csv', '.xlsx'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const processFile = useCallback((file: File): UploadedFile => {
    const id = Math.random().toString(36).substring(2);
    const uploadedFile: UploadedFile = {
      file,
      status: 'uploading',
      progress: 0,
      id
    };

    // Simulate file upload and processing
    const interval = setInterval(() => {
      setUploadedFiles(prev => {
        const updated = prev.map(f => {
          if (f.id === id) {
            if (f.progress < 100) {
              return { ...f, progress: f.progress + 10 };
            } else if (f.status === 'uploading') {
              return { ...f, status: 'processing' as const };
            } else if (f.status === 'processing') {
              clearInterval(interval);
              return { ...f, status: 'complete' as const };
            }
          }
          return f;
        });
        return updated;
      });
    }, 200);

    return uploadedFile;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = acceptedTypes.includes(extension);
      const isValidSize = file.size <= maxFileSize;
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      const processedFiles = validFiles.map(processFile);
      setUploadedFiles(prev => [...prev, ...processedFiles]);
      onFilesChange([...files, ...validFiles]);
    }
  }, [files, onFilesChange, processFile, toast]);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => {
      const removed = prev.find(f => f.id === fileId);
      const updated = prev.filter(f => f.id !== fileId);
      
      if (removed) {
        onFilesChange(files.filter(f => f.name !== removed.file.name));
      }
      
      return updated;
    });
  }, [files, onFilesChange]);

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-primary';
      case 'processing':
        return 'bg-warning';
      case 'complete':
        return 'bg-success';
      case 'error':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="surface shadow-surface">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Document Upload</h2>
            <p className="text-sm text-muted-foreground">Upload documents for AI analysis</p>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragOver 
              ? "border-primary bg-gradient-glow" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">Drop files here or click to upload</p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF, DOCX, TXT, CSV, XLSX (max 10MB each)
          </p>
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="hover:bg-primary/10 hover:border-primary transition-smooth"
          >
            Browse Files
          </Button>
        </div>

        {/* Supported Types */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {acceptedTypes.map(type => (
            <Badge key={type} variant="outline" className="text-xs">
              {type.toUpperCase()}
            </Badge>
          ))}
        </div>

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-medium text-foreground">Uploaded Files ({uploadedFiles.length})</h3>
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.id} className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <File className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium flex-1 truncate">
                    {uploadedFile.file.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(uploadedFile.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadedFile.id)}
                      className="h-6 w-6 p-0 hover:bg-destructive/10"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Progress 
                    value={uploadedFile.progress} 
                    className="flex-1 h-2"
                  />
                  <span className="text-xs text-muted-foreground w-10">
                    {uploadedFile.progress}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(uploadedFile.status)} text-white border-none`}
                  >
                    {uploadedFile.status === 'uploading' ? 'Uploading...' : 
                     uploadedFile.status === 'processing' ? 'Processing...' :
                     uploadedFile.status === 'complete' ? 'Complete' : 'Error'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};