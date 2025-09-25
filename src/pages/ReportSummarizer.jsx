import { useState, useRef } from "react";
import { Camera, Upload, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
const ReportSummarizer = () => {
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
            const file = new File([blob], 'captured-report.jpg', {
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
  const analyzeReport = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      // Simulate OCR and NLP analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockAnalysis = `
**Medical Report Analysis Summary**

**Document Type:** Blood Test Results
**Date:** ${new Date().toLocaleDateString()}

**Key Findings:**
• **Hemoglobin:** 12.5 g/dL (Normal range: 12.0-15.5 g/dL) ✅
• **White Blood Cell Count:** 7,200/μL (Normal range: 4,000-11,000/μL) ✅
• **Platelet Count:** 250,000/μL (Normal range: 150,000-450,000/μL) ✅
• **Glucose:** 95 mg/dL (Normal range: 70-100 mg/dL) ✅

**Overall Assessment:**
All values fall within normal ranges. No immediate concerns identified.

**Recommendations:**
• Maintain current health practices
• Follow up with your healthcare provider as scheduled
• Continue balanced diet and regular exercise

**Important Note:** This is an AI-generated summary. Please consult your healthcare provider for professional medical interpretation.
      `;
      setAnalysisResult(mockAnalysis);
      toast({
        title: "Analysis Complete",
        description: "Your medical report has been successfully analyzed."
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to analyze the report. Please try again.",
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
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Report Summarizer</h1>
            <p className="text-muted-foreground">Upload or capture medical reports for AI-powered analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Upload Medical Report
              </CardTitle>
              <CardDescription>
                Upload an image of your medical report or use your camera to capture it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isCameraActive && !previewUrl && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={() => fileInputRef.current?.click()} className="h-24 bg-gradient-to-r from-blue-500 to-cyan-500" size="lg">
                    <Upload className="h-6 w-6 mr-2" />
                    Upload File
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
                  <img src={previewUrl} alt="Selected report" className="w-full rounded-lg border" />
                  <div className="flex gap-4">
                    <Button onClick={analyzeReport} disabled={isProcessing} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500">
                      {isProcessing ? <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Analyzing...
                        </> : <>
                          <FileText className="h-5 w-5 mr-2" />
                          Analyze Report
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
                AI-powered summary and insights from your medical report
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult ? <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg">
                    {analysisResult}
                  </div>
                </div> : <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and analyze a medical report to see results here</p>
                </div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default ReportSummarizer;