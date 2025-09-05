import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";

interface SubjectArea {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const subjectAreas: SubjectArea[] = [
  {
    id: "business-process",
    name: "Business Process",
    description: "Current workflows, procedures, and business rules",
    icon: "🔄",
    color: "from-blue-500 to-purple-500"
  },
  {
    id: "data-management",
    name: "Data Management",
    description: "Data sources, quality, governance, and flow",
    icon: "📊",
    color: "from-green-500 to-blue-500"
  },
  {
    id: "system-integration",
    name: "System Integration",
    description: "API connections, data exchange, and interfaces",
    icon: "🔗",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "user-experience",
    name: "User Experience",
    description: "User needs, workflows, and interface requirements",
    icon: "👥",
    color: "from-orange-500 to-red-500"
  },
  {
    id: "security-compliance",
    name: "Security & Compliance",
    description: "Security requirements, regulations, and standards",
    icon: "🔒",
    color: "from-red-500 to-purple-500"
  },
  {
    id: "performance-scaling",
    name: "Performance & Scaling",
    description: "Load requirements, performance metrics, scalability",
    icon: "⚡",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description: "Hardware, hosting, deployment, and maintenance",
    icon: "🏗️",
    color: "from-gray-500 to-blue-500"
  },
  {
    id: "change-management",
    name: "Change Management",
    description: "Training, adoption, communication, and transition",
    icon: "🔄",
    color: "from-teal-500 to-green-500"
  }
];

interface SubjectAreaSelectorProps {
  selectedAreas: string[];
  onSelectionChange: (selectedAreas: string[]) => void;
}

export const SubjectAreaSelector = ({ selectedAreas, onSelectionChange }: SubjectAreaSelectorProps) => {
  const toggleArea = (areaId: string) => {
    if (selectedAreas.includes(areaId)) {
      onSelectionChange(selectedAreas.filter(id => id !== areaId));
    } else {
      onSelectionChange([...selectedAreas, areaId]);
    }
  };

  return (
    <Card className="surface shadow-surface">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <span className="text-lg">🎯</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Subject Areas</h2>
            <p className="text-sm text-muted-foreground">Select areas to focus your questionnaire on</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectAreas.map((area) => {
            const isSelected = selectedAreas.includes(area.id);
            
            return (
              <div
                key={area.id}
                onClick={() => toggleArea(area.id)}
                className={`interactive-card p-4 cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? "bg-gradient-glow border-primary shadow-primary" 
                    : "hover:bg-accent"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{area.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{area.name}</h3>
                    </div>
                  </div>
                  <div className={`transition-colors ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {isSelected ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {area.description}
                </p>
                
                {isSelected && (
                  <div className="mt-3 animate-fade-in">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Selected
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedAreas.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-glow rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Selected Areas ({selectedAreas.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedAreas.map((areaId) => {
                const area = subjectAreas.find(a => a.id === areaId);
                return area ? (
                  <Badge key={areaId} variant="secondary" className="bg-primary/10 text-primary">
                    {area.icon} {area.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};