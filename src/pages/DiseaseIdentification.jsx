import { useState, useRef } from "react";
import { Camera, Upload, Stethoscope, ArrowLeft, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
const DiseaseIdentification = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'captured-symptom.jpg', {
              type: 'image/jpeg'
            });
            setSelectedFile(file);
            setPreviewUrl(canvas.toDataURL());
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };
  const handleFileSelect = event => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  const analyzeSymptoms = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3500));
      const mockAnalysis = {
        primaryCondition: {
          name: "Dermatitis",
          confidence: 78,
          description: "Inflammation of the skin, commonly caused by allergic reactions or irritants",
          severity: "Mild to Moderate"
        },
        alternativeConditions: [{
          name: "Eczema",
          confidence: 65
        }, {
          name: "Contact Dermatitis",
          confidence: 52
        }, {
          name: "Psoriasis",
          confidence: 34
        }],
        symptoms: ["Redness and inflammation", "Dry, scaly patches", "Possible itching sensation"],
        recommendations: ["Apply moisturizer regularly", "Avoid known irritants", "Use gentle, fragrance-free soaps", "Consider topical corticosteroids if recommended by doctor"],
        whenToSeeDoctor: ["If symptoms worsen or persist", "If you develop fever", "If the area becomes infected", "If home remedies don't provide relief"],
        urgency: "routine" // routine, urgent, emergency
      };
      setAnalysisResult(mockAnalysis);
      toast({
        title: "Analysis Complete",
        description: "AI analysis has been completed successfully."
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const getConfidenceColor = confidence => {
    if (confidence >= 70) return "text-green-600";
    if (confidence >= 50) return "text-yellow-600";
    return "text-red-600";
  };
  const getUrgencyColor = urgency => {
    switch (urgency) {
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200";
      case "urgent":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Disease Identification</h1>
            <p className="text-muted-foreground">AI-powered analysis of health symptoms from images</p>
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="mb-8 border-warning/20 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-warning mt-0.5" />
              <div>
                <h3 className="font-semibold text-warning">Medical Disclaimer</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This tool provides preliminary analysis only and is not a substitute for professional medical diagnosis. 
                  Always consult with qualified healthcare providers for proper medical evaluation and treatment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-6 w-6 mr-2 text-orange-600" />
                Analyze Symptoms
              </CardTitle>
              <CardDescription>
                Upload or capture an image of the area you're concerned about
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isCameraActive && !previewUrl && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={() => fileInputRef.current?.click()} className="h-24 bg-gradient-to-r from-orange-500 to-red-500" size="lg">
                    <Upload className="h-6 w-6 mr-2" />
                    Upload Image
                  </Button>
                  <Button onClick={startCamera} variant="outline" className="h-24" size="lg">
                    <Camera className="h-6 w-6 mr-2" />
                    Use Camera
                  </Button>
                </div>}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              {/* Camera View */}
              {isCameraActive && <div className="space-y-4">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-black" />
                  <div className="flex gap-4">
                    <Button onClick={capturePhoto} className="flex-1">
                      <Camera className="h-5 w-5 mr-2" />
                      Capture Photo
                    </Button>
                    <Button onClick={stopCamera} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>}

              {/* Preview */}
              {previewUrl && <div className="space-y-4">
                  <img src={previewUrl} alt="Symptom image" className="w-full rounded-lg border" />
                  <div className="flex gap-4">
                    <Button onClick={analyzeSymptoms} disabled={isProcessing} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500">
                      {isProcessing ? <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Analyzing...
                        </> : <>
                          <Stethoscope className="h-5 w-5 mr-2" />
                          Analyze Symptoms
                        </>}
                    </Button>
                    <Button onClick={resetAnalysis} variant="outline">
                      Reset
                    </Button>
                  </div>
                </div>}

              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                AI-powered preliminary assessment of symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult ? <div className="space-y-6">
                  {/* Primary Condition */}
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {analysisResult.primaryCondition.name}
                      </h3>
                      <Badge className={getUrgencyColor(analysisResult.urgency)}>
                        {analysisResult.urgency === 'routine' ? 'Routine Care' : analysisResult.urgency === 'urgent' ? 'Urgent Care' : 'Emergency'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {analysisResult.primaryCondition.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm font-medium ${getConfidenceColor(analysisResult.primaryCondition.confidence)}`}>
                        Confidence: {analysisResult.primaryCondition.confidence}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Severity: {analysisResult.primaryCondition.severity}
                      </span>
                    </div>
                  </div>

                  {/* Alternative Conditions */}
                  <div>
                    <h4 className="font-semibold mb-3">Alternative Possibilities</h4>
                    <div className="space-y-2">
                      {analysisResult.alternativeConditions.map((condition, index) => <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="text-sm">{condition.name}</span>
                          <span className={`text-sm font-medium ${getConfidenceColor(condition.confidence)}`}>
                            {condition.confidence}%
                          </span>
                        </div>)}
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h4 className="font-semibold mb-2">Identified Symptoms</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {analysisResult.symptoms.map((symptom, index) => <li key={index}>{symptom}</li>)}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      Care Recommendations
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm bg-green-50 p-3 rounded-lg">
                      {analysisResult.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                    </ul>
                  </div>

                  {/* When to See Doctor */}
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center text-yellow-800">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      When to Consult a Doctor
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                      {analysisResult.whenToSeeDoctor.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                  </div>
                </div> : <div className="text-center py-12 text-muted-foreground">
                  <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an image to get AI-powered symptom analysis</p>
                </div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default DiseaseIdentification;