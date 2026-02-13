import "./App.css";
import { Routes, Route } from "react-router-dom"; // Αφαιρέθηκε το BrowserRouter από εδώ
import LandingPage from "./pages/LandingPage";
import MindMapViewer from "./components/MindMapViewer";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      {/* Αφαιρέσαμε το <BrowserRouter> από εδώ μέσα */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mindmap" element={<MindMapViewer />} />
      </Routes>
    </div>
  );
}

export default App;