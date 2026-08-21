"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Upload, 
  Search, 
  X, 
  Download, 
  Eye, 
  File, 
  FolderOpen, 
  BookOpen, 
  FileBadge,
  Plus
} from "lucide-react";

interface Document {
  id: number;
  title: string;
  category: string;
  file_url: string;
  uploaded_by: string;
  note: string;
  created_at: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "แบบฟอร์ม",
    file_url: "",
    uploaded_by: "",
    note: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  
  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบเอกสารนี้?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) fetchDocuments();
    } catch (error) { console.error(error); }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/documents/`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/documents/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          title: "",
          category: "แบบฟอร์ม",
          file_url: "",
          uploaded_by: "",
          note: ""
        });
        fetchDocuments();
      }
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "แบบฟอร์ม": return <FileText className="w-8 h-8 text-blue-500" />;
      case "ระเบียบ": return <BookOpen className="w-8 h-8 text-emerald-500" />;
      case "คำสั่ง": return <FileBadge className="w-8 h-8 text-amber-500" />;
      default: return <File className="w-8 h-8 text-indigo-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "แบบฟอร์ม": return "bg-blue-100 text-blue-700";
      case "ระเบียบ": return "bg-emerald-100 text-emerald-700";
      case "คำสั่ง": return "bg-amber-100 text-amber-700";
      default: return "bg-indigo-100 text-indigo-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-blue-200/40 to-cyan-200/40 blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[15%] w-16 h-16 rounded-full border-[6px] border-indigo-100/50 -z-10"></div>
      <div className="absolute bottom-[20%] left-[10%] text-purple-200/50 -z-10 rotate-45">
        <Plus className="w-12 h-12" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-white/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-500/30 rotate-3 transition-transform hover:rotate-6">
              <FolderOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent mb-2">
                06 เอกสารสำคัญ
              </h1>
              <p className="text-slate-500 text-lg font-medium">จัดเก็บและค้นหาเอกสารสำคัญทั้งหมด</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-1 z-10"
          >
            <Upload className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span>อัปโหลดเอกสาร</span>
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="flex justify-center z-10 relative">
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="ค้นหาเอกสาร (ชื่อ, หมวดหมู่)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 rounded-full border-2 border-white bg-white/60 backdrop-blur-md shadow-lg text-slate-700 text-lg focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner">
                  {getCategoryIcon(doc.category)}
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-sm ${getCategoryColor(doc.category)}`}>
                  {doc.category}
                </span>
              </div>
              
              <div className="space-y-4 flex-1">
                <h3 className="text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {doc.title}
                </h3>
                
                <div className="space-y-2 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                    <span className="truncate">{doc.uploaded_by || 'ไม่ระบุชื่อ'}</span>
                  </div>
                  {doc.note && (
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                      <p className="line-clamp-2 text-slate-400">{doc.note}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex gap-3">
                <a 
                  href={doc.file_url} 
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold transition-colors"
                >
                  <Eye className="w-4 h-4" /> ดูไฟล์
                </a>
                <a 
                  href={doc.file_url} 
                  target="_blank"
                  download
                  rel="noreferrer"
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors flex items-center justify-center"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
          {filteredDocuments.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white/60 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <FolderOpen className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-500 font-medium">ไม่พบเอกสารที่ค้นหา</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <Upload className="w-7 h-7" />
                อัปโหลดเอกสารใหม่
              </h2>
              <p className="text-indigo-100 font-medium">กรอกข้อมูลรายละเอียดเอกสารที่ต้องการจัดเก็บ</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold ml-1">ชื่อเอกสาร</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="เช่น ระเบียบการลา พ.ศ. 2567"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-slate-700 font-semibold ml-1">หมวดหมู่</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="แบบฟอร์ม">📝 แบบฟอร์ม</option>
                    <option value="ระเบียบ">⚖️ ระเบียบ</option>
                    <option value="คำสั่ง">📢 คำสั่ง</option>
                    <option value="อื่นๆ">📌 อื่นๆ</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-slate-700 font-semibold ml-1">ผู้อัปโหลด</label>
                  <input
                    type="text"
                    name="uploaded_by"
                    value={formData.uploaded_by}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                    placeholder="ชื่อของคุณ"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold ml-1">URL ของไฟล์</label>
                <input
                  type="url"
                  name="file_url"
                  required
                  value={formData.file_url}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold ml-1">หมายเหตุ (เพิ่มเติม)</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none"
                  placeholder="คำอธิบายสั้นๆ..."
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isLoading ? 'กำลังบันทึก...' : 'บันทึกเอกสาร'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
