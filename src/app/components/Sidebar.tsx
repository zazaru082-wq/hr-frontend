"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "ภาพรวม", icon: "📊", path: "/" },
    { name: "01 บุคลากร", icon: "👥", path: "/employees" },
    { name: "02 วันลา", icon: "🏖️", path: "/leave" },
    { name: "03 คิวหัวหน้า", icon: "📅", path: "/appointments" },
    { name: "04 ผลงาน", icon: "🏆", path: "/performances" },
    { name: "05 โครงการ", icon: "📁", path: "/projects" },
    { name: "06 เอกสารสำคัญ", icon: "📑", path: "/documents" },
    { name: "07 กติกา MV AI", icon: "⚖️", path: "/rules" },
    { name: "08 ทบทวนบุญ", icon: "✨", path: "/merits" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col transition-all duration-300">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-sm">น</span>
          </div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
            นฤมิตHR
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-custom px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? "bg-blue-50 text-blue-700 font-semibold shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
              )}
              <span className="text-lg opacity-90 group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
              <span className="text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100 m-3 bg-slate-50 rounded-2xl shadow-sm border border-slate-100/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center border border-white shadow-sm">
            <span className="text-blue-700 font-bold">ผด</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">ผู้ดูแลระบบ</span>
            <span className="text-xs text-slate-500 font-medium">ฝ่ายบุคคล</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
