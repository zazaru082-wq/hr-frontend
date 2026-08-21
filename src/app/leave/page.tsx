"use client";

import { useState, useEffect } from "react";

export default function LeavePage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [detailsModalType, setDetailsModalType] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ person_id: "", leave_type: "เธฅเธฒเธเนเธงเธข", start_date: "", end_date: "", reason: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [filterMode, setFilterMode] = useState('เธ—เธฑเนเธเธซเธกเธ”');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const [leavesRes, empRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/leaves/`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/employees/`)
      ]);
      if (leavesRes.ok) setLeaves(await leavesRes.json());
      if (empRes.ok) setEmployees(await empRes.json());
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/leaves/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) { 
        setShowModal(false); 
        fetchData(); 
        setFormData({ person_id: "", leave_type: "เธฅเธฒเธเนเธงเธข", start_date: "", end_date: "", reason: "" }); 
      }
    } catch (error) { console.error(error); } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/leaves/${id}/status?status=${encodeURIComponent(status)}`, { method: "PUT" });
      if (res.ok) fetchData();
    } catch (error) { console.error(error); }
  };

  const getEmployeeName = (person_id: string) => {
    const emp = employees.find(e => e.person_id === person_id);
    return emp ? `${emp.first_name || ''} ${emp.last_name || ''}`.trim() : person_id;
  };
  
  const getEmployeeAvatar = (person_id: string) => {
    const emp = employees.find(e => e.person_id === person_id);
    const name = emp ? `${emp.first_name} ${emp.last_name}` : person_id;
    return emp?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e0f2fe&color=0284c7`;
  };

  const calculateDays = (start: string, end: string) => {
    if(!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (e < s) return 0;
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays + 1;
  };

  const pendingLeaves = leaves.filter(l => l.status === 'เธฃเธญเธญเธเธธเธกเธฑเธ•เธด');
  const filteredByStatus = filterMode === 'เธ—เธฑเนเธเธซเธกเธ”' ? leaves : leaves.filter(l => l.status === filterMode);
  const displayedLeaves = filteredByStatus.filter(l => {
    if (!searchQuery) return true;
    const name = getEmployeeName(l.person_id).toLowerCase();
    const pid = l.person_id.toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || pid.includes(q);
  });
  // เธเนเธญเธกเธนเธฅเธชเธ–เธดเธ•เธดเธเธญเธเธเธเธ—เธตเนเธ–เธนเธเน€เธฅเธทเธญเธ
  const selectedPersonLeaves = selectedPersonId ? leaves.filter(l => l.person_id === selectedPersonId && l.status === 'เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง') : [];
  const selectedPersonTotalDays = selectedPersonLeaves.reduce((acc, l) => acc + calculateDays(l.start_date, l.end_date), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4 relative font-sans">
      
      {/* Decorative Elements */}
      <div className="absolute top-10 right-20 w-12 h-12 rounded-full border-[6px] border-pink-400 opacity-40 pointer-events-none"></div>
      <div className="absolute top-40 left-10 text-6xl text-sky-500 opacity-40 pointer-events-none font-black transform rotate-45">+</div>
      <div className="absolute bottom-20 right-10 text-6xl text-amber-400 opacity-40 pointer-events-none font-black transform -rotate-12">~</div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative z-10">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">02 เธงเธฑเธเธฅเธฒ</h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">เธจเธนเธเธขเนเธเธฒเธฃเธญเธเธธเธกเธฑเธ•เธด / เธ•เธฃเธงเธเธชเธญเธเธเธณเธเธญเธฅเธฒเธเธฑเธ</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-8 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all font-bold flex items-center gap-2 text-lg">
          <span className="text-xl">โ•</span> เธขเธทเนเธเธเธญเธฅเธฒเธเธฒเธ
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        
        {/* Left: Summary Cards */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
            <h3 className="text-sky-600 font-extrabold mb-6 text-xl">เธ เธฒเธเธฃเธงเธกเธเธฒเธฃเธฅเธฒเธเธฒเธ (เธเธต 2026)</h3>
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-bold text-slate-500">เธชเธดเธ—เธเธดเนเธเธเน€เธซเธฅเธทเธญ: 10 เธงเธฑเธ</span>
              <span className="text-sm font-bold text-rose-500">เนเธเนเนเธเนเธฅเนเธง: 3 เธงเธฑเธ</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[70%] h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-8">
               <div onClick={() => setDetailsModalType('เธฅเธฒเธเนเธงเธข')} className="cursor-pointer hover:bg-rose-50 hover:border-rose-200 transition-colors text-center p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm relative overflow-hidden">
                  <p className="text-xs text-slate-500 font-bold mb-1">เธฅเธฒเธเนเธงเธข</p>
                  <p className="text-2xl font-black text-rose-500">{leaves.filter(l => l.leave_type === 'เธฅเธฒเธเนเธงเธข' && l.status === 'เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง').length}</p>
               </div>
               <div onClick={() => setDetailsModalType('เธฅเธฒเธเธดเธ')} className="cursor-pointer hover:bg-sky-50 hover:border-sky-200 transition-colors text-center p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm relative overflow-hidden">
                  <p className="text-xs text-slate-500 font-bold mb-1">เธฅเธฒเธเธดเธ</p>
                  <p className="text-2xl font-black text-sky-500">{leaves.filter(l => l.leave_type === 'เธฅเธฒเธเธดเธ' && l.status === 'เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง').length}</p>
               </div>
               <div onClick={() => setDetailsModalType('เธฅเธฒเธเธเธดเธเธฑเธ•เธดเธเธฃเธฃเธก')} className="cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-colors text-center p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm relative overflow-hidden">
                  <p className="text-xs text-slate-500 font-bold mb-1">เธเธเธดเธเธฑเธ•เธดเธเธฃเธฃเธก</p>
                  <p className="text-2xl font-black text-emerald-500">{leaves.filter(l => l.leave_type === 'เธฅเธฒเธเธเธดเธเธฑเธ•เธดเธเธฃเธฃเธก' && l.status === 'เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง').length}</p>
               </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100">
            <h3 className="text-slate-800 font-extrabold mb-6 text-xl flex items-center justify-between">
              เธฃเธญเธเธฒเธฃเธญเธเธธเธกเธฑเธ•เธด 
              <span className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm shadow-md shadow-rose-500/40">
                {pendingLeaves.length}
              </span>
            </h3>
            <div className="space-y-4">
              {pendingLeaves.slice(0,3).map((l:any) => (
                <div key={l.id} className="p-5 rounded-3xl border border-slate-100 bg-slate-50 flex flex-col gap-3 relative overflow-hidden shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p onClick={() => setSelectedPersonId(l.person_id)} className="font-bold text-slate-800 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors">{getEmployeeName(l.person_id)}</p>
                      <p className="text-sm font-bold text-rose-500 mt-1">{l.leave_type}</p>
                    </div>
                    <span className="px-3 py-1.5 bg-sky-500 text-white text-xs font-bold rounded-lg shadow-sm">เธฃเธญเธ”เธณเน€เธเธดเธเธเธฒเธฃ</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{l.start_date} <span className="text-slate-300 mx-1">เธ–เธถเธ</span> {l.end_date}</p>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => handleUpdateStatus(l.id, 'เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง')} className="flex-1 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-colors">เธญเธเธธเธกเธฑเธ•เธด</button>
                    <button onClick={() => handleUpdateStatus(l.id, 'เนเธกเนเธญเธเธธเธกเธฑเธ•เธด')} className="flex-1 py-2.5 bg-white text-rose-500 border border-rose-200 font-bold rounded-xl hover:bg-rose-50 transition-colors shadow-sm">เธเธเธดเน€เธชเธ</button>
                  </div>
                </div>
              ))}
              {pendingLeaves.length === 0 && (
                <p className="text-center text-slate-400 font-bold py-4">เนเธกเนเธกเธตเธฃเธฒเธขเธเธฒเธฃเธฃเธญเธญเธเธธเธกเธฑเธ•เธด</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: All Requests */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-4 overflow-hidden flex flex-col h-full">
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
             <div className="flex gap-3">
                <button onClick={() => setFilterMode('เธ—เธฑเนเธเธซเธกเธ”')} className={`px-6 py-2.5 font-bold rounded-full transition-colors ${filterMode === 'เธ—เธฑเนเธเธซเธกเธ”' ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20' : 'text-slate-500 hover:bg-slate-50 border border-slate-200'}`}>เธเธณเธเธญเธ—เธฑเนเธเธซเธกเธ”</button>
                <button onClick={() => setFilterMode('เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง')} className={`px-6 py-2.5 font-bold rounded-full transition-colors ${filterMode === 'เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-500 hover:bg-slate-50 border border-slate-200'}`}>เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง</button>
             </div>
             <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">๐”</span>
                <input 
                  type="text" 
                  placeholder="เธเนเธเธซเธฒเธเธทเนเธญ เธซเธฃเธทเธญ เธฃเธซเธฑเธช..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
                />
             </div>
          </div>
          <div className="overflow-x-auto p-2 flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-slate-400">เธเธนเนเธฅเธฒ</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-400">เธเธฃเธฐเน€เธ เธ—เธเธฒเธฃเธฅเธฒ</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-400">เธงเธฑเธเธ—เธตเน</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-400">เธชเธ–เธฒเธเธฐ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedLeaves.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-slate-400 font-bold text-lg">เนเธกเนเธเธเธเนเธญเธกเธนเธฅเธเธฃเธฐเธงเธฑเธ•เธดเธเธฒเธฃเธฅเธฒเธเธฒเธ</td></tr>
                ) : (
                  displayedLeaves.map((l:any) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-sky-100 overflow-hidden shrink-0 border-2 border-white shadow-sm flex items-center justify-center">
                             <img src={getEmployeeAvatar(l.person_id)} alt="avatar" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span 
                              onClick={() => setSelectedPersonId(l.person_id)} 
                              className="font-bold text-slate-800 block text-base leading-tight cursor-pointer hover:text-blue-600 transition-colors inline-block"
                            >
                              {getEmployeeName(l.person_id)}
                            </span>
                            <span className="text-slate-400 text-xs font-medium block mt-0.5">{l.person_id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-sm font-bold px-3 py-1.5 rounded-lg border ${
                          l.leave_type === 'เธฅเธฒเธเนเธงเธข' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                          l.leave_type === 'เธฅเธฒเธเธเธดเธเธฑเธ•เธดเธเธฃเธฃเธก' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-sky-50 text-sky-600 border-sky-100'
                        }`}>{l.leave_type}</span>
                        <p className="text-xs text-slate-400 mt-2 font-medium line-clamp-1 max-w-[150px]">{l.reason || "เนเธกเนเธฃเธฐเธเธธเน€เธซเธ•เธธเธเธฅ"}</p>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600 font-bold">
                        {l.start_date} <br/><span className="text-slate-400 font-medium">เธ–เธถเธ</span> {l.end_date}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-2 text-xs font-bold rounded-full ${
                          l.status === 'เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' :
                          l.status === 'เนเธกเนเธญเธเธธเธกเธฑเธ•เธด' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' :
                          'bg-slate-200 text-slate-600'
                        }`}>{l.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal by Leave Type */}
      {detailsModalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
            <div className={`p-6 text-white flex justify-between items-center shrink-0 ${
              detailsModalType === 'เธฅเธฒเธเนเธงเธข' ? 'bg-gradient-to-r from-rose-500 to-pink-500' :
              detailsModalType === 'เธฅเธฒเธเธดเธ' ? 'bg-gradient-to-r from-sky-500 to-blue-500' :
              'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}>
              <h3 className="text-2xl font-extrabold flex items-center gap-2">
                <span>{detailsModalType === 'เธฅเธฒเธเนเธงเธข' ? '๐ค’' : detailsModalType === 'เธฅเธฒเธเธดเธ' ? '๐ข' : '๐ง'}</span>
                เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธเธฒเธฃ{detailsModalType}
              </h3>
              <button onClick={() => setDetailsModalType(null)} className="text-white hover:text-white/80 transition-colors bg-white/20 p-2 rounded-full backdrop-blur-md">
                <span className="text-xl font-bold">โ•</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1">
              <div className="space-y-3">
                {leaves.filter(l => l.leave_type === detailsModalType && l.status === 'เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง').length === 0 ? (
                  <div className="text-center py-10 text-slate-400 font-bold">เนเธกเนเธกเธตเธเนเธญเธกเธนเธฅเธเธฒเธฃ{detailsModalType}เธ—เธตเนเธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง</div>
                ) : (
                  leaves.filter(l => l.leave_type === detailsModalType && l.status === 'เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง').map((l:any) => (
                    <div key={l.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 hover:border-slate-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0">
                          <img src={getEmployeeAvatar(l.person_id)} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p onClick={() => { setDetailsModalType(null); setSelectedPersonId(l.person_id); }} className="font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">{getEmployeeName(l.person_id)}</p>
                          <p className="text-xs text-slate-500 font-medium">เน€เธซเธ•เธธเธเธฅ: {l.reason || '-'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-700">{l.start_date}</p>
                        <p className="text-xs text-slate-400 font-medium">เธ–เธถเธ {l.end_date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Leave Summary Modal */}
      {selectedPersonId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-slate-800 p-6 flex justify-between items-start text-white relative overflow-hidden shrink-0">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-white/20 p-1 shrink-0">
                  <img src={getEmployeeAvatar(selectedPersonId)} alt="avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">{getEmployeeName(selectedPersonId)}</h3>
                  <p className="text-slate-400 text-sm font-medium">{selectedPersonId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPersonId(null)} className="text-slate-400 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full relative z-10">
                <span className="text-xl font-bold leading-none">โ•</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-6 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">เธชเธ–เธดเธ•เธดเธเธฒเธฃเธฅเธฒเธเธฒเธ (เธญเธเธธเธกเธฑเธ•เธดเนเธฅเนเธง)</p>
                  <p className="text-3xl font-black text-slate-800">{selectedPersonLeaves.length} <span className="text-sm text-slate-500 font-bold">เธเธฃเธฑเนเธ</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">เธฃเธงเธกเธเธณเธเธงเธเธงเธฑเธ</p>
                  <p className="text-3xl font-black text-blue-600">{selectedPersonTotalDays} <span className="text-sm text-slate-500 font-bold">เธงเธฑเธ</span></p>
                </div>
              </div>

              <h4 className="font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                <span>๐“</span> เธเธฃเธฐเธงเธฑเธ•เธดเธเธฒเธฃเธฅเธฒเธเธฒเธ
              </h4>
              <div className="space-y-3">
                {selectedPersonLeaves.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 font-medium bg-white rounded-2xl border border-slate-100">เธขเธฑเธเนเธกเนเธกเธตเธเธฃเธฐเธงเธฑเธ•เธดเธเธฒเธฃเธฅเธฒเธเธฒเธเธ—เธตเนเธญเธเธธเธกเธฑเธ•เธด</div>
                ) : (
                  selectedPersonLeaves.map((l:any) => (
                    <div key={l.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          l.leave_type === 'เธฅเธฒเธเนเธงเธข' ? 'bg-rose-50 text-rose-500' :
                          l.leave_type === 'เธฅเธฒเธเธเธดเธเธฑเธ•เธดเธเธฃเธฃเธก' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'
                        }`}>{l.leave_type}</span>
                        <span className="text-slate-400 text-xs font-bold">{calculateDays(l.start_date, l.end_date)} เธงเธฑเธ</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700">{l.start_date} <span className="text-slate-400">เธ–เธถเธ</span> {l.end_date}</p>
                      {l.reason && <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 p-2 rounded-lg line-clamp-2">{l.reason}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal เนเธเธ Mobile App (Leave Request) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-8 text-white shrink-0">
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setShowModal(false)} className="text-white hover:text-blue-200 transition-colors bg-white/20 p-2 rounded-full backdrop-blur-md">
                  <span className="text-xl font-bold">โ•</span>
                </button>
                <h3 className="text-2xl font-extrabold">เธขเธทเนเธเธเธญเธฅเธฒเธเธฒเธ</h3>
                <div className="w-10"></div>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 p-1 flex shrink-0 shadow-lg overflow-hidden">
                  {formData.person_id ? (
                     <img src={getEmployeeAvatar(formData.person_id)} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                     <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-blue-500 text-xl font-black">๐‘ค</div>
                  )}
                </div>
                <div className="flex-1">
                  <select 
                    required 
                    value={formData.person_id} 
                    onChange={e => setFormData({...formData, person_id: e.target.value})} 
                    className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white outline-none font-bold text-sm w-full appearance-none mb-1"
                  >
                    <option value="" className="text-slate-800">-- เน€เธฅเธทเธญเธเธเธธเธเธฅเธฒเธเธฃ --</option>
                    {employees.map(emp => (
                      <option key={emp.person_id} value={emp.person_id} className="text-slate-800">
                        {emp.person_id} - {emp.first_name} {emp.last_name}
                      </option>
                    ))}
                  </select>
                  <p className="text-blue-100 text-xs font-medium">เธเธญเธเธ—เธธเธเธเธคเธกเธดเธ•เธจเธดเธฅเธเน</p>
                </div>
                <div className="px-4 py-1.5 bg-blue-700/50 backdrop-blur-md rounded-full text-xs font-bold border border-blue-400/30">เธฃเธญเธญเธเธธเธกเธฑเธ•เธด</div>
              </div>
            </div>

            <div className="flex px-8 pt-4 border-b border-slate-100 shrink-0 bg-white">
              <div className="px-4 py-3 border-b-[3px] border-blue-600 text-blue-600 font-extrabold text-sm">เธเนเธญเธกเธนเธฅเธเธฒเธฃเธฅเธฒ</div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
              
              <div className="flex gap-4">
                <div className="flex-1 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">เธเธฃเธฐเน€เธ เธ—เธเธฒเธฃเธฅเธฒ</p>
                  <select value={formData.leave_type} onChange={e => setFormData({...formData, leave_type: e.target.value})} className="w-full bg-transparent font-black text-slate-800 outline-none text-lg">
                    <option>เธฅเธฒเธเนเธงเธข</option><option>เธฅเธฒเธเธดเธ</option><option>เธฅเธฒเธเธเธดเธเธฑเธ•เธดเธเธฃเธฃเธก</option>
                  </select>
                </div>
                <div className="flex-1 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm text-right">
                  <p className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">เธเธณเธเธงเธเธงเธฑเธ (เธฃเธงเธก)</p>
                  <p className="font-black text-lg text-blue-600">{calculateDays(formData.start_date, formData.end_date)} เธงเธฑเธ</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-extrabold text-slate-800 mb-4">เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธงเธฑเธเธ—เธตเน</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center font-black text-lg shrink-0">๐“…</div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-bold mb-1">เธงเธฑเธเธ—เธตเนเน€เธฃเธดเนเธกเธ•เนเธ</p>
                      <input required type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full bg-transparent border-none text-slate-800 font-bold focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center font-black text-lg shrink-0">๐</div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-bold mb-1">เธงเธฑเธเธ—เธตเนเธชเธดเนเธเธชเธธเธ”</p>
                      <input required type="date" min={formData.start_date} value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full bg-transparent border-none text-slate-800 font-bold focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">เน€เธซเธ•เธธเธเธฅเธเธฒเธฃเธฅเธฒ</p>
                <textarea required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="เธฃเธฐเธเธธเน€เธซเธ•เธธเธเธฅเธเธญเธเธเธธเธ“เธ—เธตเนเธเธตเน..." className="w-full bg-transparent border-none text-slate-700 font-medium focus:outline-none resize-none" rows={3}></textarea>
              </div>
              
              <div className="pt-2">
                <button type="submit" disabled={isLoading || !formData.person_id} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-extrabold text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all disabled:opacity-50">
                  {isLoading ? "เธเธณเธฅเธฑเธเธ”เธณเน€เธเธดเธเธเธฒเธฃ..." : "เธขเธทเธเธขเธฑเธเธเธฒเธฃเธฅเธฒเธเธฒเธ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
