import React from "react";

export default function Recommendations({ items = [] }) {
  return (
    <div className="space-y-3">
      {items.map((c) => (
        <div key={c.id} className="flex items-start justify-between gap-4 p-3 rounded-md bg-white/5 hover:bg-white/6 transition">
          <div>
            <div className="text-white font-semibold">{c.title}</div>
            <div className="text-sm text-white/60">{c.reason}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/60 mb-2">{Math.round(c.score * 100)}% match</div>
            <button className="px-3 py-1 bg-indigo-500 rounded text-white">Start</button>
          </div>
        </div>
      ))}
    </div>
  );
}
