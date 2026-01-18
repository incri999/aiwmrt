import { useState } from "react";
import { Recycle, UploadCloud } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeWaste = async () => {
    if (!image) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch(`${API_URL}/analyze-waste`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to analyze image");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Could not analyze the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <Recycle size={36} />
          <h1>AI Waste Classification</h1>
        </div>

        <label className="upload">
          <UploadCloud size={18} />
          <span>{image ? image.name : "Choose an image"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            hidden
          />
        </label>

        <button onClick={analyzeWaste} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Waste"}
        </button>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result">
            <p>
              <strong>Type:</strong> {result.waste_type}
            </p>
            <p>
              <strong>Confidence:</strong> {result.confidence}%
            </p>
            <p>
              <strong>Disposal:</strong> {result.disposal_method}
            </p>
            <p>
              <strong>Tip:</strong> {result.sustainability_tip}
            </p>
          </div>
        )}
      </div>

      <footer>
        ♻️ Built for sustainability & smart waste management
      </footer>
    </div>
  );
}

export default App;
