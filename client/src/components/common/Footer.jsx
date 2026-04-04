import React from 'react';

export default function Footer() {
  return (
    <footer className="app-surface mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 text-sm text-slate-500 md:grid-cols-2 md:items-center">
        <small>
          © {new Date().getFullYear()} <span className="font-semibold text-slate-900">TechCart</span>. Next-gen tech, delivered fast.
        </small>
        <div className="text-left md:text-right">
          <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-600">Phones</span>
          <span className="ml-2 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">Laptops</span>
          <span className="ml-2 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">Gaming</span>
        </div>
      </div>
    </footer>
  );
}
