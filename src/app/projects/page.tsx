"use client";

import React, { useState, useEffect } from "react";

// Project interface
interface Project {
  project_id: string;
  id: number;
  name: string;
  description: string;
  owner: string;
  status: string;
  progress: number;
  start_date: string;
  end_date: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    owner: "",
    status: "กำลังดำเนินการ",
    progress: 0,
    start_date: "",
    end_date: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/projects/`);
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลโครงการได้");
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันการลบโครงการนี้?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      setSubmitError("");
      const url = editMode 
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/projects/${selectedId}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/projects/`;
      
      const payload: any = editMode ? { ...formData } : { ...formData, project_id: `PJ-${Date.now().toString().slice(-4)}` };
      if (!payload.start_date) payload.start_date = null;
      if (!payload.end_date) payload.end_date = null;
      
      const res = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setEditMode(false);
        setSelectedId(null);
        await fetchProjects();
        setFormData({
          name: "", description: "", owner: "", status: "กำลังดำเนินการ", progress: 0, start_date: "", end_date: ""
        });
      } else {
        const errData = await res.text();
        setSubmitError(`Error: ${res.status} ${errData}`);
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Unknown error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "กำลังดำเนินการ": return "bg-blue-100 text-blue-800 border-blue-200";
      case "เสร็จสิ้น": return "bg-green-100 text-green-800 border-green-200";
      case "รอเริ่ม": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-500 mb-2">
              05 โครงการ
            </h1>
            <p className="text-slate-600 text-lg">ติดตามความก้าวหน้าของโครงการทั้งหมด</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
          >
            + เพิ่มโครงการใหม่
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-[2.5rem] shadow-xl text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-300 border border-slate-100 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-slate-800 line-clamp-2">{project.name}</h3>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(project.status)} whitespace-nowrap ml-3`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-slate-500 mb-6 flex-grow line-clamp-3">
                  {project.description}
                </p>

                <div className="space-y-5 mt-auto">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-700">ความคืบหน้า</span>
                      <span className="font-bold text-blue-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-teal-400 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm">
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">ผู้รับผิดชอบ</span>
                      <span className="font-medium text-slate-700 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-bold">
                          {project.owner.charAt(0)}
                        </div>
                        {project.owner}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">ระยะเวลา</span>
                      <span className="font-medium text-slate-700">
                        {project.start_date} - {project.end_date}
                      </span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <button onClick={() => { setEditMode(true); setSelectedId(project.project_id); setFormData(project as any); setIsModalOpen(true); }} className="flex-1 py-2 rounded-xl bg-amber-50 text-amber-600 font-bold text-xs hover:bg-amber-100 transition-colors">
                      แก้ไข
                    </button>
                    <button onClick={() => handleDelete(project.project_id)} className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition-colors">
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {projects.length === 0 && (
              <div className="col-span-full bg-white p-12 rounded-[2.5rem] shadow-xl text-center border border-slate-100">
                <p className="text-slate-500 text-lg">ยังไม่มีข้อมูลโครงการ</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-blue-700 to-teal-500 p-8 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-bold">{editMode ? 'แก้ไขโครงการ' : 'เพิ่มโครงการใหม่'}</h2>
                <p className="text-blue-100 mt-1">กรอกข้อมูลรายละเอียดโครงการด้านล่าง</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors text-2xl">&times;</button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">ชื่อโครงการ</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-colors"
                      placeholder="ระบุชื่อโครงการ"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">รายละเอียด</label>
                    <textarea
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-colors resize-none"
                      placeholder="ระบุรายละเอียดโครงการ"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">ผู้รับผิดชอบ</label>
                    <input
                      type="text"
                      name="owner"
                      required
                      value={formData.owner}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-colors"
                      placeholder="ชื่อผู้รับผิดชอบ"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">สถานะ</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-colors"
                    >
                      <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                      <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                      <option value="รอเริ่ม">รอเริ่ม</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="flex justify-between text-sm font-semibold text-slate-700">
                      <span>ความคืบหน้า</span>
                      <span className="text-blue-600">{formData.progress}%</span>
                    </label>
                    <input
                      type="range"
                      name="progress"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={handleInputChange}
                      className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">วันที่เริ่ม</label>
                    <input
                      type="date"
                      name="start_date"
                      required
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">วันที่สิ้นสุด</label>
                    <input
                      type="date"
                      name="end_date"
                      required
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-full text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center"
                  >
                    {submitLoading ? "กำลังบันทึก..." : "บันทึกโครงการ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}