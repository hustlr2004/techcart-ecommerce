import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/products', label: 'Manage Products' },
  { to: '/admin/orders', label: 'Manage Orders' },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-indigo-500">Admin Panel</p>
      <nav className="space-y-2">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`block rounded-2xl px-4 py-3 font-semibold transition ${
                active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
