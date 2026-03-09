import React from "react";

export default function AppHeader() {
  return (
    <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/60 sticky top-0 z-10">
      <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">OT</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-100 leading-tight">
              Open Tab
            </h1>
            <p className="text-xs text-slate-400 leading-tight">Veresiye Takip</p>
          </div>
        </div>
      </div>
    </header>
  );
}
