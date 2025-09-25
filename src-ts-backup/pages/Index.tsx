import { Camera, FileText, Pill, Utensils, Heart, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: "reports",
      title: "Report Summarizer",
      description: "Upload or photograph medical reports for AI-powered analysis and summaries",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      path: "/reports"
    },
    {
      id: "medicine",
      title: "Medicine Information",
      description: "Scan medicine bottles and tablets to get detailed information and usage instructions",
      icon: Pill,
      gradient: "from-green-500 to-emerald-500",
      path: "/medicine"
    },
    {
      id: "diagnosis",
      title: "Disease Identification",
      description: "Analyze health symptoms through images for preliminary condition assessment",
      icon: Stethoscope,
      gradient: "from-orange-500 to-red-500",
      path: "/diagnosis"
    },
    {
      id: "nutrition",
      title: "Nutrition Analysis",
      description: "Get personalized diet plans based on your health conditions and requirements",
      icon: Utensils,
      gradient: "from-purple-500 to-pink-500",
      path: "/nutrition"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MedLens Assist
              </h1>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
            Your intelligent healthcare companion for medical reports, medicine information, disease identification, and personalized nutrition
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            AI-Powered Healthcare
            <span className="block text-primary mt-2">At Your Fingertips</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empower yourself with instant medical insights, medicine information, symptom analysis, and personalized nutrition guidance
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/60 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground text-base mt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={() => navigate(feature.path)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">AI-Powered</div>
            <div className="text-muted-foreground">Advanced machine learning for accurate analysis</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-accent">Secure</div>
            <div className="text-muted-foreground">Your medical data is protected and private</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-success">24/7</div>
            <div className="text-muted-foreground">Access healthcare insights anytime, anywhere</div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 p-6 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong className="text-warning">Medical Disclaimer:</strong> This application provides informational content only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;