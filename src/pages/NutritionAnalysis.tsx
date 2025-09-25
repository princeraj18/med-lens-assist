import { useState } from "react";
import { Utensils, ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NutritionAnalysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState("");
  const [nutritionPlan, setNutritionPlan] = useState<any>(null);

  const commonConditions = [
    "Diabetes Type 2",
    "Hypertension",
    "Heart Disease",
    "High Cholesterol",
    "Pregnancy",
    "Obesity",
    "Anemia",
    "Osteoporosis",
    "Kidney Disease",
    "Liver Disease"
  ];

  const addCondition = (condition: string) => {
    if (condition && !healthConditions.includes(condition)) {
      setHealthConditions([...healthConditions, condition]);
      setNewCondition("");
    }
  };

  const removeCondition = (condition: string) => {
    setHealthConditions(healthConditions.filter(c => c !== condition));
  };

  const generateNutritionPlan = async () => {
    if (!age || !gender || !weight || !height || !activityLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all basic information fields.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate nutrition plan generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const bmi = Number(weight) / Math.pow(Number(height) / 100, 2);
      
      const mockNutritionPlan = {
        personalInfo: {
          bmi: bmi.toFixed(1),
          bmiCategory: bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese",
          dailyCalories: activityLevel === "low" ? 1800 : activityLevel === "moderate" ? 2200 : 2600
        },
        macronutrients: {
          carbohydrates: { percentage: 45, grams: 250, sources: ["Whole grains", "Fruits", "Vegetables"] },
          proteins: { percentage: 25, grams: 140, sources: ["Lean meats", "Fish", "Legumes", "Dairy"] },
          fats: { percentage: 30, grams: 75, sources: ["Olive oil", "Nuts", "Avocado", "Fish oil"] }
        },
        recommendedFoods: [
          { category: "Vegetables", items: ["Spinach", "Broccoli", "Bell peppers", "Carrots"], servings: "5-7 per day" },
          { category: "Fruits", items: ["Berries", "Apples", "Citrus fruits", "Bananas"], servings: "2-3 per day" },
          { category: "Proteins", items: ["Salmon", "Chicken breast", "Lentils", "Greek yogurt"], servings: "2-3 per day" },
          { category: "Grains", items: ["Quinoa", "Brown rice", "Oats", "Whole wheat bread"], servings: "3-4 per day" }
        ],
        avoidFoods: [
          "Processed meats",
          "Refined sugars",
          "Trans fats",
          "Excessive sodium",
          "Alcohol (limit consumption)"
        ],
        specificRecommendations: healthConditions.includes("Diabetes Type 2") ? [
          "Focus on complex carbohydrates",
          "Monitor portion sizes",
          "Include fiber-rich foods",
          "Limit simple sugars"
        ] : healthConditions.includes("Hypertension") ? [
          "Reduce sodium intake to <2300mg/day",
          "Increase potassium-rich foods",
          "Choose DASH diet principles",
          "Limit processed foods"
        ] : [
          "Maintain balanced meals",
          "Stay hydrated",
          "Include variety in your diet",
          "Practice portion control"
        ],
        supplements: [
          { name: "Vitamin D", dosage: "1000 IU daily", reason: "Bone health support" },
          { name: "Omega-3", dosage: "1000mg daily", reason: "Heart and brain health" },
          { name: "Multivitamin", dosage: "1 daily", reason: "Fill nutritional gaps" }
        ],
        mealTiming: {
          breakfast: "7:00-8:00 AM",
          lunch: "12:00-1:00 PM",
          dinner: "6:00-7:00 PM",
          snacks: "Mid-morning and afternoon as needed"
        }
      };
      
      setNutritionPlan(mockNutritionPlan);
      toast({
        title: "Nutrition Plan Generated",
        description: "Your personalized nutrition plan has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "Failed to generate nutrition plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setWeight("");
    setHeight("");
    setActivityLevel("");
    setHealthConditions([]);
    setNutritionPlan(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nutrition Analysis</h1>
            <p className="text-muted-foreground">Get personalized diet plans based on your health profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Utensils className="h-6 w-6 mr-2 text-purple-600" />
                Health Profile
              </CardTitle>
              <CardDescription>
                Provide your health information for personalized nutrition recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Sedentary)</SelectItem>
                    <SelectItem value="moderate">Moderate (Light exercise)</SelectItem>
                    <SelectItem value="high">High (Regular exercise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Health Conditions */}
              <div>
                <Label>Health Conditions</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {healthConditions.map((condition) => (
                    <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                      {condition}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeCondition(condition)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add health condition"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCondition(newCondition)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addCondition(newCondition)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonConditions.map((condition) => (
                    <Button
                      key={condition}
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => addCondition(condition)}
                      disabled={healthConditions.includes(condition)}
                    >
                      + {condition}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={generateNutritionPlan}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Utensils className="h-5 w-5 mr-2" />
                      Generate Plan
                    </>
                  )}
                </Button>
                <Button onClick={resetForm} variant="outline">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Nutrition Plan</CardTitle>
              <CardDescription>
                Your customized diet and nutrition recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {nutritionPlan ? (
                <div className="space-y-6">
                  {/* Personal Stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{nutritionPlan.personalInfo.bmi}</div>
                      <div className="text-sm text-muted-foreground">BMI</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{nutritionPlan.personalInfo.dailyCalories}</div>
                      <div className="text-sm text-muted-foreground">Daily Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{nutritionPlan.personalInfo.bmiCategory}</div>
                      <div className="text-sm text-muted-foreground">Category</div>
                    </div>
                  </div>

                  {/* Macronutrients */}
                  <div>
                    <h4 className="font-semibold mb-3">Macronutrient Distribution</h4>
                    <div className="space-y-3">
                      {Object.entries(nutritionPlan.macronutrients).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                          <span className="capitalize font-medium">{key}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{value.percentage}% ({value.grams}g)</div>
                            <div className="text-xs text-muted-foreground">
                              {value.sources.slice(0, 2).join(", ")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Foods */}
                  <div>
                    <h4 className="font-semibold mb-3">Recommended Foods</h4>
                    <div className="space-y-3">
                      {nutritionPlan.recommendedFoods.map((category: any, index: number) => (
                        <div key={index} className="border-l-4 border-green-400 pl-3">
                          <div className="font-medium text-green-700">{category.category}</div>
                          <div className="text-sm text-muted-foreground mb-1">{category.servings}</div>
                          <div className="text-sm">{category.items.join(", ")}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Foods to Avoid */}
                  <div>
                    <h4 className="font-semibold mb-3">Foods to Limit/Avoid</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm bg-red-50 p-3 rounded-lg">
                      {nutritionPlan.avoidFoods.map((food: string, index: number) => (
                        <li key={index} className="text-red-700">{food}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Specific Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3">Specific Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm bg-blue-50 p-3 rounded-lg">
                      {nutritionPlan.specificRecommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-blue-700">{rec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Meal Timing */}
                  <div>
                    <h4 className="font-semibold mb-3">Recommended Meal Timing</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {Object.entries(nutritionPlan.mealTiming).map(([meal, time]: [string, string]) => (
                        <div key={meal} className="flex justify-between p-2 bg-muted/20 rounded">
                          <span className="capitalize font-medium">{meal}</span>
                          <span className="text-muted-foreground">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in your health profile to generate a personalized nutrition plan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NutritionAnalysis;