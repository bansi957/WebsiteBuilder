import { ArrowLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { serverUrl } from "../App";
function Generate() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Preparing your request...");
  const intervalRef = useRef(null);

  const loadingSteps = [
    "Analyzing your idea...",
    "Planning the page structure...",
    "Writing the first layout draft...",
    "Refining details and visuals...",
    "Finalizing your website...",
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const stopLoadingState = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setLoading(false);
    setProgress(0);
    setStatusText("Preparing your request...");
  };

  const handleGenerateWebsite = async () => {
    setLoading(true);
    setProgress(4);
    setStatusText(loadingSteps[0]);

    let stepIndex = 0;
    intervalRef.current = setInterval(() => {
      stepIndex = (stepIndex + 1) % loadingSteps.length;
      setProgress((current) => Math.min(current + 7, 92));
      setStatusText(loadingSteps[stepIndex]);
    }, 1800);

    try {
      const result = await axios.post(
        `${serverUrl}/api/website/generate`,
        { prompt },
        {
          withCredentials: true,
        }
      );
      setProgress(100);
      setStatusText("Website generated successfully.");
      // alert(result.data.message)
      setTimeout(() => {
        stopLoadingState();
        console.log(result);
        navigate(`/editor/${result.data.websiteId}`);
      }, 400);
    } catch (error) {
      stopLoadingState();
      console.log(error);
    }
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-semibold">
              GenWeb<span className="text-zinc-400">.ai</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold  mb-5 leading-tight">
            Build Websites with
            <span className="block bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Real AI Power
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
         
            This process may take several minutes. genweb.ai focuses on quality,
            not shortcuts.
          </p>
        </motion.div>
        <div className="mb-14">
        
          <h1 className="text-xl font-semibold mb-2"> Describe your website</h1>
          <div className="relative">
            <textarea
            onChange={e=>setPrompt(e.target.value)}
            value={prompt}
              name=""
              id=""
              placeholder="Describe your website in detail..."
              className="w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20"
            ></textarea>
          </div>
        </div>
        <div className="flex justify-center">
          <motion.button
            type="button"
            onClick={handleGenerateWebsite}
            whileHover={prompt.trim() && !loading ? { scale: 1.05 } : undefined}
            whileTap={prompt.trim() && !loading ? { scale: 0.96 } : undefined}
            disabled={loading || !prompt.trim()}
            className={`relative w-full max-w-sm overflow-hidden rounded-2xl px-10 py-3.5 font-semibold text-base transition ${
              prompt.trim() && !loading
                ? "bg-white text-black"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            <span className="relative z-10">{loading ? "Generating..." : "Generate Website"}</span>
          </motion.button>
        </div>
        {loading ? (
          <div className="mx-auto mt-4 max-w-xl px-2 text-sm text-zinc-400">
            <div className="mb-2 flex items-center justify-between">
              <span>{statusText}</span>
              <span className="font-medium text-white">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-400 via-cyan-300 to-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Generate;