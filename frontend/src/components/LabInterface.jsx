import { useEffect, useState } from "react";
import { completeLab, startLab, stopLab } from "../api/labs";
import { markLabStarted, markLabCompleted } from "../services/user.service";

const LAB_TYPE_MAP = {
  "sql-injection": "sqli",
  xss: "xss",
  "command-injection": "cmdi",
  "file-upload": "upload",
};

export default function LabInterface({ lab, onBack, user }) {
  const [instance, setInstance] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flag, setFlag] = useState("");


  useEffect(() => {
    const saved = localStorage.getItem("runningLab");
    if (!saved) return;

    const parsed = JSON.parse(saved);
    const elapsed = Math.floor((Date.now() - parsed.startedAt) / 1000);
    const total = parsed.ttl * 60;
    const remainingSec = total - elapsed;

    if (remainingSec > 0) {
      setInstance(parsed);
      setRemaining(remainingSec);
    } else {
      localStorage.removeItem("runningLab");
    }
  }, []);

  async function handleStart() {
    try {
      setLoading(true);
      setError(null);

      const type = LAB_TYPE_MAP[lab.category];
      if(!type){
        throw new Error("Lab type isn't defined");
      }
      const res = await startLab(type, user.uid);
      if (!res || !res.containerName || !res.url || !res.ttl) {
        throw new Error("Invalid lab instance response from server");
      }
      const persisted = {
        ...res,
        startedAt: Date.now(),
      };

      localStorage.setItem("runningLab", JSON.stringify(persisted));
      setInstance(persisted);
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
      if (!instance?.containerName) return;
      await stopLab(instance.containerName);
      localStorage.removeItem("runningLab");
      setInstance(null);
      setRemaining(null);
      setFlag("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitFlag(){
    try{
      setLoading(true);
      setError(null);
      const type = LAB_TYPE_MAP[lab.category];
      if(!type){
        throw new Error("Lab type isn't defined");
      }
      if (!instance || !user) return;
      const res = await completeLab(instance.historyId, flag, type, user.uid);
      if(res.success==true){
        await stopLab(instance.containerName);
      }else{
        throw new Error("Lab isn't completed yet");
      }
      localStorage.removeItem("runningLab");
      setInstance(null);
      setRemaining(null);
      setFlag("");
    }catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (remaining === null) return;

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem("runningLab");
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
            rel="noreferrer"
            className="text-blue-400 underline"
          >
            Open Lab
          </a>
          <div className="flex gap-3">
            <input
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            placeholder="Enter flag"
            className="flex-1 bg-[#0a0e27] border border-gray-700 px-4 py-2 rounded text-white"
            />
            <button
              onClick={handleSubmitFlag}
              disabled ={loading}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              >Submit</button>
          </div>

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
