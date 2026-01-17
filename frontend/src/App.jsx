import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an image.");
      return;
    }

    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${API_URL}/analyze-waste`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">AI Waste Classification</h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Analyze Waste
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        {result && (
          <div className="mt-4 bg-gray-50 p-4 rounded text-left">
            <p><strong>Type:</strong> {result.waste_type}</p>
            <p><strong>Confidence:</strong> {result.confidence}</p>
            <p><strong>Disposal:</strong> {result.disposal_method}</p>
            <p>
              <strong>Tip:</strong>{" "}
              {result.sustainability_tip || "No tip provided."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
