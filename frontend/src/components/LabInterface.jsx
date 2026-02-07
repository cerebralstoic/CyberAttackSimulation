import { useEffect, useState } from "react";
import { startLab, stopLab } from "../api/labs";

const LAB_TYPE_MAP = {
  "sql-injection": "sqli",
  xss: "xss",
  "command-injection": "cmdi",
  "file-upload": "uploadfile",
};

export default function LabInterface({ lab, onBack }) {
  const [instance, setInstance] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleStart() {
    try {
      setLoading(true);
      setError(null);
      const type = LAB_TYPE_MAP[lab.category];
      const res = await startLab(type);
      setInstance(res);
      setRemaining(res.ttl * 60);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStop() {
    try {
      setLoading(true);
      await stopLab(instance.containerName);
      setInstance(null);
      setRemaining(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!remaining) return;

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setInstance(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining]);

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-gray-400 hover:text-gray-200"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-semibold mb-2">{lab.name}</h1>
      <p className="text-gray-400 mb-6">{lab.description}</p>

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {!instance ? (
        <button
          onClick={handleStart}
          disabled={loading}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          {loading ? "Starting..." : "Start Lab"}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="text-green-400 font-medium">Status: Running</div>

          <div className="text-yellow-400">
            Time Remaining: {formatTime(remaining)}
          </div>

          <a
            href={instance.url}
            target="_blank"
            className="text-blue-400 underline"
          >
            Open Lab
          </a>

          <button
            onClick={handleStop}
            disabled={loading}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            {loading ? "Stopping..." : "Stop Lab"}
          </button>
        </div>
      )}
    </div>
  );
}
