import { useState, useRef } from "react";
import { Camera, Upload, Pill, ArrowLeft, Loader2, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const MedicineInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [medicineInfo, setMedicineInfo] = useState<any>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
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
      const stream = videoRef.current.srcObject as MediaStream;
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
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-medicine.jpg', { type: 'image/jpeg' });
            setSelectedFile(file);
            setPreviewUrl(canvas.toDataURL());
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const identifyMedicine = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate medicine identification
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockMedicineData = {
        name: "Paracetamol",
        genericName: "Acetaminophen",
        strength: "500mg",
        manufacturer: "Generic Pharma",
        type: "Tablet",
        uses: [
          "Pain relief",
          "Fever reduction",
          "Headache treatment",
          "Muscle pain relief"
        ],
        dosage: {
          adults: "1-2 tablets every 4-6 hours",
          children: "Consult pediatrician for proper dosage",
          maxDaily: "8 tablets (4000mg) per day"
        },
        sideEffects: [
          "Nausea (rare)",
          "Allergic reactions (very rare)",
          "Liver damage (with overdose)"
        ],
        contraindications: [
          "Severe liver disease",
          "Alcohol dependency",
          "Known allergy to acetaminophen"
        ],
        interactions: [
          "Warfarin (blood thinner)",
          "Isoniazid (TB medication)",
          "Alcohol (increases liver toxicity risk)"
        ],
        storage: "Store at room temperature, away from moisture and heat",
        warnings: [
          "Do not exceed recommended dose",
          "Consult doctor if symptoms persist",
          "Not recommended during pregnancy without medical advice"
        ]
      };
      
      setMedicineInfo(mockMedicineData);
      toast({
        title: "Medicine Identified",
        description: "Successfully identified the medicine and retrieved information.",
      });
    } catch (error) {
      toast({
        title: "Identification Error",
        description: "Failed to identify the medicine. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setMedicineInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
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
            <h1 className="text-3xl font-bold text-foreground">Medicine Information</h1>
            <p className="text-muted-foreground">Scan medicines to get detailed information and usage instructions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="h-6 w-6 mr-2 text-green-600" />
                Scan Medicine
              </CardTitle>
              <CardDescription>
                Upload an image of medicine bottle, tablet, or packaging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isCameraActive && !previewUrl && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-24 bg-gradient-to-r from-green-500 to-emerald-500"
                    size="lg"
                  >
                    <Upload className="h-6 w-6 mr-2" />
                    Upload Image
                  </Button>
                  <Button
                    onClick={startCamera}
                    variant="outline"
                    className="h-24"
                    size="lg"
                  >
                    <Camera className="h-6 w-6 mr-2" />
                    Use Camera
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Camera View */}
              {isCameraActive && (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg bg-black"
                  />
                  <div className="flex gap-4">
                    <Button onClick={capturePhoto} className="flex-1">
                      <Camera className="h-5 w-5 mr-2" />
                      Capture Photo
                    </Button>
                    <Button onClick={stopCamera} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Preview */}
              {previewUrl && (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Selected medicine"
                    className="w-full rounded-lg border"
                  />
                  <div className="flex gap-4">
                    <Button
                      onClick={identifyMedicine}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Identifying...
                        </>
                      ) : (
                        <>
                          <Pill className="h-5 w-5 mr-2" />
                          Identify Medicine
                        </>
                      )}
                    </Button>
                    <Button onClick={resetAnalysis} variant="outline">
                      Reset
                    </Button>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Medicine Information</CardTitle>
              <CardDescription>
                Detailed information about the identified medicine
              </CardDescription>
            </CardHeader>
            <CardContent>
              {medicineInfo ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="border-b pb-4">
                    <h3 className="text-2xl font-bold text-foreground">{medicineInfo.name}</h3>
                    <p className="text-muted-foreground">Generic: {medicineInfo.genericName}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{medicineInfo.strength}</Badge>
                      <Badge variant="outline">{medicineInfo.type}</Badge>
                    </div>
                  </div>

                  {/* Uses */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-1 text-blue-600" />
                      Uses
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {medicineInfo.uses.map((use: string, index: number) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Dosage */}
                  <div>
                    <h4 className="font-semibold mb-2">Dosage</h4>
                    <div className="text-sm space-y-1 bg-muted/50 p-3 rounded-lg">
                      <p><strong>Adults:</strong> {medicineInfo.dosage.adults}</p>
                      <p><strong>Children:</strong> {medicineInfo.dosage.children}</p>
                      <p><strong>Maximum Daily:</strong> {medicineInfo.dosage.maxDaily}</p>
                    </div>
                  </div>

                  {/* Side Effects */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />
                      Side Effects
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {medicineInfo.sideEffects.map((effect: string, index: number) => (
                        <li key={index}>{effect}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Warnings */}
                  <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center text-destructive">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Important Warnings
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {medicineInfo.warnings.map((warning: string, index: number) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Scan a medicine to see detailed information here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicineInfo;