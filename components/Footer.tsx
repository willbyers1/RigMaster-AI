import React from 'react';

export function Footer() {
  return (
    <footer className="w-full py-6 mt-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="container flex flex-col items-center justify-center gap-1 mx-auto text-center">
        <p className="text-sm font-medium text-slate-200">
          Created By <span className="text-cyan-400">Mert Batu Bülbül</span>
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Computer Engineering Undergraduate
        </p>
      </div>
    </footer>
  );
}