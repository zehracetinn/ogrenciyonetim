import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50 disabled:pointer-events-none bg-slate-900 text-white hover:bg-slate-700 h-10 py-2 px-4 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}