import { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/analyze-waste",
        formData
      );
      setResult(res.data);
      setError("");
    } catch {
      setError("Failed to analyze image.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-4">♻ AI Waste Management</h1>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button
          onClick={analyze}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded"
        >
          Analyze Waste
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {result && (
          <div className="mt-4 text-sm">
            <p><b>Type:</b> {result.waste_type}</p>
            <p><b>Confidence:</b> {result.confidence}</p>
            <p><b>Disposal:</b> {result.disposal_method}</p>
            <p><b>Tip:</b> {result.sustainability_tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
