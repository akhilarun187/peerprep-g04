import { BrowserRouter, Routes, Route } from "react-router-dom";
import MatchingPage from "./pages/MatchingPage";
import CollabPage from "./pages/CollabPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MatchingPage />} />
        <Route path="/collab/:sessionId" element={<CollabPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
