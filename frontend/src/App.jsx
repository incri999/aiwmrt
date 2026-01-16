import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!image) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${API_URL}/analyze-waste`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          AI Waste Classification
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Waste"}
        </button>

        {error && (
          <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
        )}

        {result && (
          <div className="mt-5 bg-gray-50 p-4 rounded-lg">
            <p>
              <strong>Waste Type:</strong> {result.waste_type}
            </p>
            <p>
              <strong>Confidence:</strong> {result.confidence}%
            </p>
            <p>
              <strong>Disposal Method:</strong> {result.disposal_method}
            </p>
            <p>
              <strong>Sustainability Tip:</strong>{" "}
              {result.sustainability_tip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
