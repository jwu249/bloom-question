import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Share, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id?: string;
  text: string;
  type?: 'text' | 'multiple-choice' | 'scale' | 'yes-no';
}

interface QuestionnaireSection {
  title: string;
  description?: string;
  questions: string[] | Question[];
}

interface Questionnaire {
  title: string;
  description?: string;
  sections: QuestionnaireSection[];
  metadata?: {
    generatedAt?: string;
    totalQuestions?: number;
  };
}

interface ProjectData {
  name: string;
  client: string;
  type: string;
  timeline: string;
  selectedAreas: string[];
  aiEnabled: boolean;
}

interface QuestionnairePreviewProps {
  questionnaire: Questionnaire;
  projectData: ProjectData;
}

export const QuestionnairePreview = ({ questionnaire, projectData }: QuestionnairePreviewProps) => {
  const { toast } = useToast();

  const totalQuestions = questionnaire.sections.reduce((total, section) => {
    return total + section.questions.length;
  }, 0);

  const handleExport = (format: 'word' | 'pdf' | 'json') => {
    // Simulate export functionality
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} document...`,
    });
    
    // In a real app, this would trigger a download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your questionnaire has been exported as ${format.toUpperCase()}.`,
      });
    }, 2000);
  };

  const handleCopyToClipboard = () => {
    const content = generateTextContent();
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "Questionnaire content has been copied.",
      });
    });
  };

  const generateTextContent = () => {
    let content = `${questionnaire.title}\n\n`;
    content += `Project: ${projectData.name}\n`;
    content += `Client: ${projectData.client}\n`;
    content += `Type: ${projectData.type}\n`;
    content += `Timeline: ${projectData.timeline}\n\n`;
    
    questionnaire.sections.forEach((section, sectionIndex) => {
      content += `${sectionIndex + 1}. ${section.title}\n`;
      if (section.description) {
        content += `${section.description}\n`;
      }
      content += '\n';
      
      section.questions.forEach((question, questionIndex) => {
        const questionText = typeof question === 'string' ? question : question.text;
        content += `${sectionIndex + 1}.${questionIndex + 1} ${questionText}\n`;
      });
      content += '\n';
    });
    
    return content;
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="surface shadow-surface">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{questionnaire.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generated questionnaire ready for use
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Project Summary */}
          <div className="bg-gradient-glow p-4 rounded-lg">
            <h3 className="font-medium mb-3">Project Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Project:</span>
                <p className="font-medium">{projectData.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Client:</span>
                <p className="font-medium">{projectData.client}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <p className="font-medium">{projectData.type}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Timeline:</span>
                <p className="font-medium">{projectData.timeline}</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {questionnaire.sections.length} Sections
              </Badge>
              <Badge variant="secondary" className="bg-success/10 text-success">
                {totalQuestions} Questions
              </Badge>
              {projectData.aiEnabled && (
                <Badge variant="secondary" className="bg-warning/10 text-warning">
                  ✨ AI Enhanced
                </Badge>
              )}
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleExport('word')}
              className="bg-gradient-primary hover:shadow-primary transition-smooth"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Word
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="hover:bg-primary/10 hover:border-primary"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="hover:bg-primary/10 hover:border-primary"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questionnaire Content */}
      <Card className="surface shadow-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📋</span>
            Questionnaire Content
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {questionnaire.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {sectionIndex + 1}. {section.title}
                </h3>
                {section.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {section.description}
                  </p>
                )}
              </div>
              
              <div className="space-y-3 pl-4">
                {section.questions.map((question, questionIndex) => {
                  const questionText = typeof question === 'string' ? question : question.text;
                  
                  return (
                    <div key={questionIndex} className="flex gap-3">
                      <span className="text-primary font-medium text-sm mt-0.5 min-w-[2rem]">
                        {sectionIndex + 1}.{questionIndex + 1}
                      </span>
                      <p className="text-foreground leading-relaxed">
                        {questionText}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              {sectionIndex < questionnaire.sections.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <Card className="surface shadow-surface">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Generated on {new Date().toLocaleDateString()} • {totalQuestions} questions across {questionnaire.sections.length} sections
            </div>
            <Button
              variant="outline"
              className="hover:bg-primary/10 hover:border-primary"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Questionnaire
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};