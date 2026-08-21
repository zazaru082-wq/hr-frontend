"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X, ChevronDown, ChevronUp, FileText, User, Calendar, Tag, AlertCircle } from "lucide-react";

interface Rule {
  id: number;
  title: string;
  content: string;
  category: string;
  created_by: string;
  created_at: string;
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [filteredRules, setFilteredRules] = useState<Rule[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRules(rules);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredRules(
        rules.filter(
          (rule) =>
            rule.title.toLowerCase().includes(lowerQuery) ||
            rule.content.toLowerCase().includes(lowerQuery)
        )
      );
    }
  }, [searchQuery, rules]);

  
  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/rules/${id}`, { method: 'DELETE' });
      if (res.ok) fetchRules();
    } catch (error) { console.error(error); }
  };

  async function fetchRules() {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/rules/`);
      if (res.ok) {
        const data = await res.json();
        setRules(data);
      } else {
        console.error("Failed to fetch rules");
        // Fallback data for preview purposes if API is down
        setRules([
          {
            id: 1,
            title: "เวลาเข้างาน",
            content: "พนักงานทุกคนต้องสแกนนิ้วเข้าทำงานก่อนเวลา 09:00 น. หากมาสายเกิน 3 ครั้งจะมีการตักเตือน",
            category: "ระเบียบวินัย",
            created_by: "HR Admin",
            created_at: "2024-01-15T09:00:00Z"
          },
          {
            id: 2,
            title: "การแต่งกาย",
            content: "อนุญาตให้แต่งกายชุดสุภาพ หรือ Smart Casual ห้ามสวมรองเท้าแตะและกางเกงขาสั้นในวันจันทร์-พฤหัสบดี",
            category: "ทั่วไป",
            created_by: "HR Admin",
            created_at: "2024-01-16T10:30:00Z"
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const url = editMode 
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/rules/${selectedId}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/rules/`;
      
      const res = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditMode(false);
        setSelectedId(null);
        fetchRules();
        setFormData({ category: 'ระเบียบการลา', title: '', content: '' });
      }
    } catch (err) { console.error(err); } 
    finally { setIsSubmitting(false); }
  }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryColor = (cat: string) => {
    const colors = [
      "bg-blue-100 text-blue-700 border-blue-200",
      "bg-purple-100 text-purple-700 border-purple-200",
      "bg-green-100 text-green-700 border-green-200",
      "bg-rose-100 text-rose-700 border-rose-200",
      "bg-amber-100 text-amber-700 border-amber-200",
    ];
    let hash = 0;
    for (let i = 0; i < cat.length; i++) {
      hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[100px] opacity-60 z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-blue-200 rounded-full blur-[100px] opacity-60 z-0 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl p-8 md:p-12 mb-8 border border-white/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent mb-2">
                07 กติกา MV AI
              </h1>
              <p className="text-slate-500 text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                กติกาและข้อตกลงในการทำงานร่วมกัน
              </p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all duration-300 font-medium"
            >
              <Plus className="w-5 h-5" />
              เพิ่มกติกาใหม่
            </button>
          </div>

          <div className="mt-8 relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="ค้นหากติกา (ชื่อเรื่อง, เนื้อหา)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 rounded-2xl border-none bg-slate-100 focus:bg-white focus:ring-2 focus:ring-purple-500 shadow-inner transition-all duration-300 outline-none text-slate-700 text-lg"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-lg p-16 text-center border border-white/50">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">ไม่พบข้อมูลกติกา</h3>
              <p className="text-slate-500">ลองค้นหาด้วยคำอื่น หรือเพิ่มกติกาใหม่</p>
            </div>
          ) : (
            filteredRules.map((rule, index) => (
              <div 
                key={rule.id} 
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden"
              >
                <div 
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  onClick={() => toggleExpand(rule.id)}
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-inner flex-shrink-0">
                      <span className="text-slate-600 font-bold text-lg">{(index + 1).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-slate-800">{rule.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(rule.category || 'ทั่วไป')}`}>
                          {rule.category || 'ทั่วไป'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2 md:mt-0">
                        <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {rule.created_by || 'Unknown'}</span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" /> 
                          {rule.created_at ? new Date(rule.created_at).toLocaleDateString('th-TH') : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center self-end md:self-auto group-hover:bg-purple-50 transition-colors flex-shrink-0">
                    {expandedId === rule.id ? (
                      <ChevronUp className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedId === rule.id ? 'max-h-[1000px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-5 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100">
                    {rule.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-center text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6" />
                เพิ่มกติกาใหม่
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">หัวข้อกติกา</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    placeholder="เช่น ระเบียบการเข้างาน..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">หมวดหมู่</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                      placeholder="เช่น ระเบียบวินัย, ทั่วไป..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่อผู้สร้าง</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={createdBy}
                      onChange={(e) => setCreatedBy(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                      placeholder="ชื่อ-นามสกุล..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">เนื้อหากติกา</label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                    placeholder="รายละเอียดกติกา..."
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3.5 rounded-full text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-full text-white font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "บันทึกข้อมูล"
                    )}
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
