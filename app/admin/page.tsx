"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Check login
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setAuth(true);
      } else {
        alert("Incorrect password");
      }
    } catch (e) {
      alert("Error connecting");
    } finally {
      setLoading(false);
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-center">Admin Access</h1>
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold transition-all"
          >
            {loading ? "Checking..." : "Unlock Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Love Link Analytics 📊</h1>
          <button 
            onClick={() => { setAuth(false); setStats(null); }} 
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Total Links" value={stats.totalLinks} color="bg-blue-100 text-blue-800" />
          <Card title="Accepted" value={stats.acceptedCount} color="bg-green-100 text-green-800" />
          <Card title="Rejected" value={stats.rejectedCount} color="bg-red-100 text-red-800" />
          <Card title="Conversion Rate" 
            value={stats.totalLinks > 0 ? ((stats.acceptedCount / stats.totalLinks) * 100).toFixed(1) + "%" : "0%"} 
            color="bg-purple-100 text-purple-800" 
          />
        </div>

        {/* Breakdown */}
        {/* Details Table */}
        {/* Detailed Analytics Table */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Live Activity Feed
            </h2>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Updates
            </div>
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-gray-100">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50">
                  <tr>
                     <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Link Name</th>
                     <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                     <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Engagement</th>
                     <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Interaction Time</th>
                     <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Cursor Travel</th>
                     <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Last Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white/50">
                  {stats.recentLinks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                        No activity recorded yet. Send some links!
                      </td>
                    </tr>
                  ) : (
                    stats.recentLinks.map((link: any) => {
                       const events = link.events || [];
                       const lastEvent = events[events.length - 1];
                       const meta = lastEvent?.metadata as any || {};
                       
                       let timeDisplay = "0s";
                       if (meta.timeTakenMs) {
                          const sec = (meta.timeTakenMs / 1000).toFixed(1);
                          timeDisplay = `${sec}s`;
                       }

                       // Determine Row Style based on status
                       const isAccepted = events.some((e: any) => e.type === "ACCEPT");
                       const isRejected = events.some((e: any) => e.type === "FINAL_REJECT");
                       const rowClass = isAccepted ? "bg-green-50/30" : isRejected ? "bg-red-50/30" : "hover:bg-gray-50/50";

                       return (
                          <tr key={link.id} className={`transition-colors ${rowClass}`}>
                             <td className="p-4">
                                <div className="font-bold text-gray-800">{link.name}</div>
                                <div className="text-xs text-purple-600">from {link.creatorName || "Unknown"}</div>
                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">{link.id}</div>
                             </td>
                             <td className="p-4">
                                {isAccepted ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Accepted 💖
                                  </span>
                                ) : isRejected ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Rejected 💔
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Pending ⏳
                                  </span>
                                )}
                             </td>
                             <td className="p-4 text-gray-600">
                                <div className="flex flex-col text-xs space-y-1">
                                  <span title="Times they tried to click Reject">🚫 Rejects: {meta.rejectCount || 0}</span>
                                  <span title="Times the button ran away">🏃 Dodges: {meta.dodgeCount || 0}</span>
                                </div>
                             </td>
                             <td className="p-4 font-mono text-gray-600 text-xs">
                                {timeDisplay}
                             </td>
                             <td className="p-4">
                                <span className="text-xs text-gray-500 font-semibold">
                                  {meta.mouseDistancePx ? `${meta.mouseDistancePx}px moved` : "No movement"}
                                </span>
                             </td>
                             <td className="p-4 text-xs font-bold text-gray-500">
                                {lastEvent?.type || "CREATED"}
                                {lastEvent?.type === "CLICK" && meta.x && (
                                  <div className="text-[10px] font-mono text-gray-400 font-normal mt-1">
                                    Clicked {meta.targetText ? `"${meta.targetText}"` : meta.targetTag} at {meta.x},{meta.y}
                                  </div>
                                )}
                             </td>
                          </tr>
                       );
                    })
                  )}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color }: any) {
  return (
    <div className={`p-6 rounded-xl shadow-sm border ${color}`}>
       <div className="text-sm opacity-80 uppercase tracking-wider font-semibold">{title}</div>
       <div className="text-4xl font-bold mt-2">{value}</div>
    </div>
  );
}
