import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, FileText, Sparkles, Download, CheckCircle } from "lucide-react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { SubjectAreaSelector } from "@/components/SubjectAreaSelector";
import { QuestionnairePreview } from "@/components/QuestionnairePreview";

const Index = () => {
  const [projectData, setProjectData] = useState({
    name: "",
    client: "",
    type: "",
    timeline: "",
    context: "",
    aiEnabled: false,
    selectedAreas: [] as string[]
  });
  
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionnaire, setQuestionnaire] = useState<any>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setQuestionnaire({
        title: `Discovery Questionnaire - ${projectData.name}`,
        sections: [
          {
            title: "Business Overview",
            questions: [
              "What are the primary business objectives for this project?",
              "How does this initiative align with your strategic goals?",
              "What specific challenges are you hoping to address?"
            ]
          },
          {
            title: "Current State Analysis", 
            questions: [
              "What systems and processes are currently in place?",
              "What are the main pain points in your existing workflow?",
              "How do stakeholders currently interact with these systems?"
            ]
          }
        ]
      });
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-surface">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">BSA Discovery Questionnaire Tool</h1>
              <p className="text-sm text-muted-foreground">AI-powered questionnaire generator for business analysis</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center gap-4 mb-6">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-smooth ${
                    step >= stepNum 
                      ? "bg-gradient-primary text-white" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
                  </div>
                  {stepNum < 3 && <div className={`w-12 h-0.5 transition-smooth ${
                    step > stepNum ? "bg-primary" : "bg-muted"
                  }`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Project Configuration */}
            {step === 1 && (
              <Card className="surface shadow-surface">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-primary p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Project Configuration</h2>
                      <p className="text-sm text-muted-foreground">Set up your discovery project details</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="e.g. Customer Portal Modernization"
                        value={projectData.name}
                        onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="client">Client/Organization</Label>
                      <Input
                        id="client"
                        placeholder="e.g. Acme Corporation"
                        value={projectData.client}
                        onChange={(e) => setProjectData({...projectData, client: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="project-type">Project Type</Label>
                      <Select onValueChange={(value) => setProjectData({...projectData, type: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system-implementation">System Implementation</SelectItem>
                          <SelectItem value="process-improvement">Process Improvement</SelectItem>
                          <SelectItem value="digital-transformation">Digital Transformation</SelectItem>
                          <SelectItem value="integration">System Integration</SelectItem>
                          <SelectItem value="modernization">Legacy Modernization</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="timeline">Timeline</Label>
                      <Select onValueChange={(value) => setProjectData({...projectData, timeline: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3-months">1-3 months</SelectItem>
                          <SelectItem value="3-6-months">3-6 months</SelectItem>
                          <SelectItem value="6-12-months">6-12 months</SelectItem>
                          <SelectItem value="12-plus-months">12+ months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="context">Additional Context</Label>
                      <Textarea
                        id="context"
                        placeholder="Provide any additional context about the project..."
                        value={projectData.context}
                        onChange={(e) => setProjectData({...projectData, context: e.target.value})}
                        className="mt-1 min-h-[80px]"
                      />
                    </div>

                    {/* AI Enhancement Toggle */}
                    <div className="bg-gradient-glow p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <div>
                            <Label htmlFor="ai-toggle" className="text-sm font-medium">AI-Enhanced Analysis</Label>
                            <p className="text-xs text-muted-foreground">Upload documents for AI-powered insights</p>
                          </div>
                        </div>
                        <Switch
                          id="ai-toggle"
                          checked={projectData.aiEnabled}
                          onCheckedChange={(checked) => setProjectData({...projectData, aiEnabled: checked})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setStep(2)}
                    className="w-full mt-6 bg-gradient-primary hover:shadow-primary transition-smooth"
                    disabled={!projectData.name || !projectData.client}
                  >
                    Continue to Subject Areas
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Subject Areas & Upload */}
            {step === 2 && (
              <div className="space-y-6">
                <SubjectAreaSelector
                  selectedAreas={projectData.selectedAreas}
                  onSelectionChange={(areas) => setProjectData({...projectData, selectedAreas: areas})}
                />
                
                {/* Document Upload - Always show when AI is enabled */}
                {projectData.aiEnabled && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        Document Upload
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Upload relevant documents for AI-enhanced analysis and contextual questions
                      </p>
                    </div>
                    <FileUploadZone
                      files={uploadedFiles}
                      onFilesChange={setUploadedFiles}
                    />
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-primary hover:shadow-primary transition-smooth"
                    disabled={projectData.selectedAreas.length === 0}
                  >
                    Generate Questionnaire
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Generation */}
            {step === 3 && (
              <Card className="surface shadow-surface">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-primary p-3 rounded-full w-fit mx-auto">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold">Ready to Generate</h2>
                    <p className="text-muted-foreground">
                      Your questionnaire will be generated based on the selected areas
                      {projectData.aiEnabled && uploadedFiles.length > 0 && " and uploaded documents"}.
                    </p>
                    
                    <div className="bg-muted p-4 rounded-lg text-left space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Project:</span>
                        <span className="font-medium">{projectData.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Subject Areas:</span>
                        <span className="font-medium">{projectData.selectedAreas.length}</span>
                      </div>
                      {projectData.aiEnabled && (
                        <div className="flex justify-between text-sm">
                          <span>Documents:</span>
                          <span className="font-medium">{uploadedFiles.length}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(2)} 
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleGenerate}
                        className="flex-1 bg-gradient-primary hover:shadow-primary transition-smooth"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                          </div>
                        ) : (
                          "Generate Questionnaire"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Preview/Results */}
          <div className="space-y-6">
            {questionnaire ? (
              <QuestionnairePreview questionnaire={questionnaire} projectData={projectData} />
            ) : (
              <Card className="surface shadow-surface h-fit">
                <CardContent className="p-8 text-center">
                  <div className="bg-muted p-6 rounded-full w-fit mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Questionnaire Preview</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete the configuration to see your generated questionnaire here.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline">🎯 Targeted Questions</Badge>
                    <Badge variant="outline">📊 Structured Sections</Badge>
                    <Badge variant="outline">⚡ AI-Powered</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;