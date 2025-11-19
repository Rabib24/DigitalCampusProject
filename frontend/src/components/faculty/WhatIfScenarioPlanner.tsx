"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calculator,
  Plus,
  Trash2,
  Play,
  Save,
  Download
} from "lucide-react";

interface ScenarioParameter {
  id: string;
  name: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  step: number;
}

interface ScenarioResult {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: "up" | "down" | "neutral";
}

interface SavedScenario {
  id: string;
  name: string;
  parameters: ScenarioParameter[];
  results: ScenarioResult[];
  createdAt: string;
}

export default function WhatIfScenarioPlanner() {
  const [scenarioName, setScenarioName] = useState("New Scenario");
  const [parameters, setParameters] = useState<ScenarioParameter[]>([
    {
      id: "1",
      name: "Student Enrollment",
      currentValue: 30,
      minValue: 10,
      maxValue: 100,
      step: 1
    },
    {
      id: "2",
      name: "Assignment Weight",
      currentValue: 40,
      minValue: 0,
      maxValue: 100,
      step: 5
    },
    {
      id: "3",
      name: "Class Participation",
      currentValue: 10,
      minValue: 0,
      maxValue: 50,
      step: 1
    }
  ]);
  
  const [results, setResults] = useState<ScenarioResult[]>([
    {
      id: "1",
      name: "Average Grade",
      value: 82.5,
      change: 3.2,
      trend: "up"
    },
    {
      id: "2",
      name: "Pass Rate",
      value: 94,
      change: 2.1,
      trend: "up"
    },
    {
      id: "3",
      name: "Student Satisfaction",
      value: 4.2,
      change: 0.3,
      trend: "up"
    }
  ]);
  
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([
    {
      id: "1",
      name: "Increased Participation",
      parameters: [
        {
          id: "1",
          name: "Student Enrollment",
          currentValue: 35,
          minValue: 10,
          maxValue: 100,
          step: 1
        },
        {
          id: "2",
          name: "Assignment Weight",
          currentValue: 35,
          minValue: 0,
          maxValue: 100,
          step: 5
        },
        {
          id: "3",
          name: "Class Participation",
          currentValue: 20,
          minValue: 0,
          maxValue: 50,
          step: 1
        }
      ],
      results: [
        {
          id: "1",
          name: "Average Grade",
          value: 85.2,
          change: 5.9,
          trend: "up"
        },
        {
          id: "2",
          name: "Pass Rate",
          value: 96,
          change: 4.1,
          trend: "up"
        }
      ],
      createdAt: "2023-10-15"
    }
  ]);
  
  const [newParameter, setNewParameter] = useState({
    name: "",
    currentValue: 0,
    minValue: 0,
    maxValue: 100,
    step: 1
  });
  
  const handleParameterChange = (id: string, value: number) => {
    setParameters(parameters.map(param => 
      param.id === id ? { ...param, currentValue: value } : param
    ));
  };
  
  const handleAddParameter = () => {
    if (!newParameter.name.trim()) {
      alert("Please enter a parameter name");
      return;
    }
    
    const parameter: ScenarioParameter = {
      id: (parameters.length + 1).toString(),
      name: newParameter.name,
      currentValue: newParameter.currentValue,
      minValue: newParameter.minValue,
      maxValue: newParameter.maxValue,
      step: newParameter.step
    };
    
    setParameters([...parameters, parameter]);
    
    // Reset form
    setNewParameter({
      name: "",
      currentValue: 0,
      minValue: 0,
      maxValue: 100,
      step: 1
    });
  };
  
  const handleRemoveParameter = (id: string) => {
    if (parameters.length <= 1) {
      alert("You must have at least one parameter");
      return;
    }
    setParameters(parameters.filter(param => param.id !== id));
  };
  
  const handleRunScenario = () => {
    // In a real application, this would run complex calculations
    // For demo purposes, we'll simulate results based on parameters
    
    const simulatedResults: ScenarioResult[] = [
      {
        id: "1",
        name: "Average Grade",
        value: 80 + (parameters[0].currentValue * 0.1),
        change: (parameters[0].currentValue * 0.1) - 2.5,
        trend: (parameters[0].currentValue * 0.1) - 2.5 > 0 ? "up" : "down"
      },
      {
        id: "2",
        name: "Pass Rate",
        value: 90 + (parameters[1].currentValue * 0.05),
        change: (parameters[1].currentValue * 0.05) - 1.0,
        trend: (parameters[1].currentValue * 0.05) - 1.0 > 0 ? "up" : "down"
      },
      {
        id: "3",
        name: "Student Satisfaction",
        value: 3.5 + (parameters[2].currentValue * 0.03),
        change: (parameters[2].currentValue * 0.03) - 0.5,
        trend: (parameters[2].currentValue * 0.03) - 0.5 > 0 ? "up" : "down"
      }
    ];
    
    setResults(simulatedResults);
  };
  
  const handleSaveScenario = () => {
    if (!scenarioName.trim()) {
      alert("Please enter a scenario name");
      return;
    }
    
    const scenario: SavedScenario = {
      id: (savedScenarios.length + 1).toString(),
      name: scenarioName,
      parameters: [...parameters],
      results: [...results],
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setSavedScenarios([scenario, ...savedScenarios]);
    alert("Scenario saved successfully!");
  };
  
  const handleLoadScenario = (scenario: SavedScenario) => {
    setScenarioName(scenario.name);
    setParameters(scenario.parameters);
    setResults(scenario.results);
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              What-If Scenario Planner
            </CardTitle>
            <CardDescription>
              Analyze the potential impact of different academic strategies
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Input
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="w-64"
              placeholder="Scenario name"
            />
            <Button variant="outline" className="gap-2" onClick={handleSaveScenario}>
              <Save size={16} />
              Save
            </Button>
            <Button variant="outline" className="gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Parameters
                </CardTitle>
                <CardDescription>
                  Adjust variables to see their impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {parameters.map((param) => (
                  <div key={param.id} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`param-${param.id}`}>{param.name}</Label>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveParameter(param.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-12">
                        {param.minValue}
                      </span>
                      <Input
                        id={`param-${param.id}`}
                        type="range"
                        min={param.minValue}
                        max={param.maxValue}
                        step={param.step}
                        value={param.currentValue}
                        onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {param.maxValue}
                      </span>
                    </div>
                    <div className="text-center">
                      <Badge variant="secondary" className="text-lg">
                        {param.currentValue}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Add New Parameter</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="new-param-name">Parameter Name</Label>
                      <Input
                        id="new-param-name"
                        value={newParameter.name}
                        onChange={(e) => setNewParameter({...newParameter, name: e.target.value})}
                        placeholder="e.g., Attendance Rate"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor="new-param-min">Min</Label>
                        <Input
                          id="new-param-min"
                          type="number"
                          value={newParameter.minValue}
                          onChange={(e) => setNewParameter({...newParameter, minValue: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-param-max">Max</Label>
                        <Input
                          id="new-param-max"
                          type="number"
                          value={newParameter.maxValue}
                          onChange={(e) => setNewParameter({...newParameter, maxValue: parseFloat(e.target.value) || 100})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-param-step">Step</Label>
                        <Input
                          id="new-param-step"
                          type="number"
                          value={newParameter.step}
                          onChange={(e) => setNewParameter({...newParameter, step: parseFloat(e.target.value) || 1})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="new-param-value">Default Value</Label>
                      <Input
                        id="new-param-value"
                        type="number"
                        value={newParameter.currentValue}
                        onChange={(e) => setNewParameter({...newParameter, currentValue: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <Button onClick={handleAddParameter} className="w-full gap-2">
                      <Plus size={16} />
                      Add Parameter
                    </Button>
                  </div>
                </div>
                
                <Button onClick={handleRunScenario} className="w-full gap-2">
                  <Play size={16} />
                  Run Scenario
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Results
                </CardTitle>
                <CardDescription>
                  Projected outcomes based on current parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {results.map((result) => (
                    <Card key={result.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{result.name}</h3>
                          {getTrendIcon(result.trend)}
                        </div>
                        <div className="mt-2">
                          <div className="text-2xl font-bold">{result.value.toFixed(1)}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={result.change > 0 ? "text-green-500" : result.change < 0 ? "text-red-500" : "text-muted-foreground"}>
                              {result.change > 0 ? '+' : ''}{result.change.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              from baseline
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 h-64 flex items-center justify-center bg-muted/10 rounded-lg">
                  <div className="text-center">
                    <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">
                      Visualization would appear here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Showing comparative results across scenarios
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Saved Scenarios
                </CardTitle>
                <CardDescription>
                  Previously run scenarios for comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {savedScenarios.length > 0 ? (
                    savedScenarios.map((scenario) => (
                      <div 
                        key={scenario.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleLoadScenario(scenario)}
                      >
                        <div>
                          <h3 className="font-medium">{scenario.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {scenario.parameters.length} parameters • {new Date(scenario.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Load
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Save className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        No saved scenarios
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}