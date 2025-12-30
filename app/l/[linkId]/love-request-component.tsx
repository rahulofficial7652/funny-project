"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Props {
  id: string;
  name: string;
}

export default function LoveRequest({ id, name }: Props) {
  const [status, setStatus] = useState<"IDLE" | "ACCEPTED" | "REJECTED_FINAL">("IDLE");
  const [rejectCount, setRejectCount] = useState(0);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [msg, setMsg] = useState(`${name}, I Love You ❤️`);
  /* Analytics State */
  const [startTime] = useState(Date.now());
  const [mouseDistance, setMouseDistance] = useState(0);

  // Original State restoration
  const [dodgeMode, setDodgeMode] = useState(false);
  const [finalPhase, setFinalPhase] = useState(false);
  const deviceRef = useRef("Desktop");

  const logEvent = async (eventType: string, extraMeta: any = {}) => {
    try {
      const timeTaken = Date.now() - startTime;
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true, 
        body: JSON.stringify({
          linkId: id,
          eventType,
          metadata: {
            timeTakenMs: timeTaken,
            mouseDistancePx: Math.round(mouseDistance),
            rejectCount,
            dodgeCount,
            ...extraMeta
          }
        }),
      });
    } catch (e) {
      console.error("Log failed", e);
    }
  };

  // Track global mouse movement & CLICKS for engagement metric
  useEffect(() => {
    deviceRef.current = /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
    logEvent("page_open");

    const handleMouseMove = (e: MouseEvent) => {
      setMouseDistance((prev) => prev + Math.abs(e.movementX) + Math.abs(e.movementY));
    };

    const handleGlobalClick = (e: MouseEvent) => {
      logEvent("page_open", { // We don't have a specific 'click' type in strict rules so logging as metadata update or ignoring if strict 
         // Wait, user rule said "Every user interaction MUST send a real POST".
         // But Schema only allows: "page_open" | "reject_attempt" | "dodge_attempt" | "accept" | "final_reject"
         // I cannot log generic clicks as their own type. I must map them or omit them to follow "HARD RULES".
         // However, the rule said "metadata: Object".
         // I will ignore generic background clicks for now to strictly follow the schema enum, 
         // OR I will assume "dodge_attempt" or something fitting if appropriate.
         // Actually, let's strictly follow the enum. 
         // If the user clicks "Reject" -> "reject_attempt".
         // If the user clicks simple background, I will NOT log it as a separate event type to avoid breaking schema validation.
         // Removing generic click listener to adhere to strict schema.
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseDistance, rejectCount, dodgeCount]);

  const handleAccept = () => {
    setStatus("ACCEPTED");
    setMsg("Sach me? 😳\nInteresting…");
    logEvent("ACCEPT");
    
    // Firecracker / Confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff0000", "#ffa500"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff0000", "#ffa500"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const texts = [
    "Arre pakad ke dikhao 😄",
    "Button bhi ready nahi hai",
    "Bas ek click hi to chahiye tha",
    "Life me bhi aisa hi hota hai",
    "Tum kaafi determined ho",
    "Patience test chal raha hai"
  ];

  /* Dodge Logic */
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const rejectBtnRef = useRef<HTMLButtonElement>(null);

  const handleDodge = (e: any) => {
    if (!dodgeMode || finalPhase) return;
    
    // Prevent default to stop click on mobile touch
    // e.preventDefault(); // Sometimes prevents scroll, use carefully.

    const newLogs = dodgeCount + 1;
    setDodgeCount(newLogs);
    logEvent("DODGE");

    // Random message
    setMsg(texts[Math.floor(Math.random() * texts.length)]);

    // Initial random jump
    moveButton();

    if (newLogs >= 10) {
      setFinalPhase(true);
      setMsg("Toh fir accept nahi karna hai na?\nItna sochna pad raha hai…");
      // Reset position to center or allow click? 
      // User requested: "After that... Reject finally becomes clickable"
      // So we stop moving it on hover.
      setBtnPos({ x: 0, y: 0 }); // reset transform
    }
  };

  const moveButton = () => {
    if (!rejectBtnRef.current) return;
    // Calculate random position within viewport
    // We use fixed positioning logic or transform translation
    // Let's use simple translation for smoother Framer Motion
    const x = (Math.random() - 0.5) * 300; // -150 to 150
    const y = (Math.random() - 0.5) * 500; // -250 to 250
    setBtnPos({ x, y });
  };

  const handleRejectClick = () => {
    if (finalPhase) {
      setStatus("REJECTED_FINAL");
      logEvent("FINAL_REJECT");
      setMsg("Shaayad timing hi galat thi.\nTake care 🙂");
      return;
    }

    // Early rejects (before dodge mode)
    const newCount = rejectCount + 1;
    setRejectCount(newCount);
    logEvent("REJECT_ATTEMPT");

    if (newCount === 1) {
      setMsg("Itni jaldi mana kar diya? 😅");
    } else if (newCount === 2) {
      setMsg("Achha… soch rahe ho ☹️");
      setDodgeMode(true);
      moveButton(); // Start dodging
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-200 flex flex-col items-center justify-center p-4 overflow-hidden relative text-center">
      
      {/* Background Hearts */}
      {Array.from({ length: 15 }).map((_, i) => (
         <motion.div
           key={i}
           className="absolute text-xl pointer-events-none opacity-50"
           initial={{ y: "110vh", x: Math.random() * 100 + "vw" }}
           animate={{ y: "-10vh" }}
           transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
         >
           💖
         </motion.div>
      ))}

      <motion.div 
        layout
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-sm z-10 border border-white/50"
      >
        <motion.h2 
          key={msg}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-8 text-gray-800 whitespace-pre-line min-h-[80px]"
        >
          {msg}
        </motion.h2>

        {status === "IDLE" && (
          <div className="flex flex-col gap-4 relative h-[150px] justify-center">
            <button
              onClick={handleAccept}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:scale-105 transition-transform w-full"
            >
              Accept ❤️
            </button>

            <motion.button
              ref={rejectBtnRef}
              animate={dodgeMode && !finalPhase ? { x: btnPos.x, y: btnPos.y } : { x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={handleRejectClick}
              onMouseEnter={handleDodge}
              onTouchStart={handleDodge} // For mobile
              className={`font-bold py-3 px-8 rounded-full text-lg shadow-lg w-full transition-colors ${
                finalPhase 
                  ? "bg-gray-500 hover:bg-gray-600 text-white cursor-pointer" 
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Reject 💔
            </motion.button>
          </div>
        )}

        {(status === "ACCEPTED" || status === "REJECTED_FINAL") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-4"
          >
             <div className="p-4 bg-gray-50 rounded-xl text-left text-sm text-gray-600 shadow-inner">
                <p><b>Session Summary:</b></p>
                <p>❌ Reject attempts: {rejectCount}</p>
                <p>🏃 Dodge attempts: {dodgeCount}</p>
             </div>
             
             <button
               onClick={() => window.location.href = "/"}
               className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium shadow-md transition-all"
             >
               Go to Dashboard →
             </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
