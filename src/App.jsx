import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ReportSummarizer from "./pages/ReportSummarizer";
import MedicineInfo from "./pages/MedicineInfo";
import DiseaseIdentification from "./pages/DiseaseIdentification";
import NutritionAnalysis from "./pages/NutritionAnalysis";
const queryClient = new QueryClient();
const App = () => <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reports" element={<ReportSummarizer />} />
          <Route path="/medicine" element={<MedicineInfo />} />
          <Route path="/diagnosis" element={<DiseaseIdentification />} />
          <Route path="/nutrition" element={<NutritionAnalysis />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>;
export default App;