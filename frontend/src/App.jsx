import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/analyze-waste`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Couldn't analyze the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          AI Waste Classification
        </h1>

        <input
          type="file"
          accept="image/*"
          className="mb-4 w-full"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Waste"}
        </button>

        {error && (
          <p className="text-red-600 mt-4 text-center">{error}</p>
        )}

        {result && (
          <div className="mt-4 bg-gray-100 p-4 rounded">
            <p><strong>Type:</strong> {result.waste_type}</p>
            <p><strong>Confidence:</strong> {result.confidence}</p>
            <p><strong>Disposal:</strong> {result.disposal_method}</p>
            <p><strong>Tip:</strong>{" "}
              {result.sustainability_tip || "No tip provided."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
