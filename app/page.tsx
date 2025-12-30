"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link as LinkIcon, Copy, Check } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Background hearts animation
  const hearts = Array.from({ length: 15 });

  const handleGenerate = async () => {
    if (!name.trim() || !creatorName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverName: name, creatorName }),
      });
      const data = await res.json();
      if (data.id) {
        setGeneratedLink(`${window.location.origin}/l/${data.id}`);
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center p-4">
      {/* Ambient Hearts */}
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl cursor-default select-none pointer-events-none"
          initial={{
            opacity: 0,
            y: "100vh",
            x: Math.random() * 100 + "vw",
          }}
          animate={{
            opacity: [0, 1, 0],
            y: "-10vh",
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        >
          💖
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border border-white/50 relative z-10"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Love Link 💖
        </h1>
        <p className="text-gray-600 mb-8">
          Create a playful interactive prank link for your crush (or friend) and see what they choose!
        </p>

        {!generatedLink ? (
          <div className="space-y-4">
            <input
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="Your Name (Who is sending?)"
              className="w-full text-purple-900 px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/50 transition-all"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Their Name (Who is it for?)"
              className="w-full text-red-900 px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/50 transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !name.trim() || !creatorName.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                "Creating Magic..."
              ) : (
                <>
                  <LinkIcon size={18} /> Generate Link
                </>
              )}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 break-all text-sm text-pink-700 font-mono">
              {generatedLink}
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button
                onClick={() => {
                   const text = `Hey ${name}, check this out! 💖\n${generatedLink}`;
                   window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="flex-1 bg-[#25D366] text-white py-3 rounded-xl hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 font-medium"
              >
                Share 🚀
              </button>
            </div>
            
            <button 
              onClick={() => { setGeneratedLink(""); setName(""); setCreatorName(""); }}
              className="text-sm text-gray-500 hover:text-gray-700 underline mt-4"
            >
              Create another link
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
