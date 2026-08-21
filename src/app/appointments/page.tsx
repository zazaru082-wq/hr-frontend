"use client";

import { useState, useEffect } from 'react';

interface Schedule {
  id: number;
  date: string;
  time_str: string;
  topic: string;
  location: string;
  meal: string;
  driver: string;
  note: string;
  status?: string;
}

export default function AppointmentsPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    date: '',
    time_str: '',
    topic: '',
    location: '',
    meal: '',
    driver: '',
    note: ''
  });

  // Calendar States
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(new Date());

  async function fetchSchedules() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/schedules/`);
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setEditId(null);
    setFormData({
      date: formatDateString(selectedDate),
      time_str: '',
      topic: '',
      location: '',
      meal: '',
      driver: '',
      note: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (schedule: Schedule) => {
    setEditMode(true);
    setEditId(schedule.id);
    setFormData({
      date: schedule.date,
      time_str: schedule.time_str,
      topic: schedule.topic,
      location: schedule.location || '',
      meal: schedule.meal || '',
      driver: schedule.driver || '',
      note: schedule.note || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคิวงานนี้?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/schedules/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchSchedules();
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editMode && editId 
        ? `http://127.0.0.1:8000/api/schedules/${editId}` 
        : 'http://127.0.0.1:8000/api/schedules/';
        
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchSchedules();
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatThaiDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calendar Logic
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const todayStr = formatDateString(new Date());
  const selectedDateStr = formatDateString(selectedDate);
  const selectedSchedules = schedules.filter(s => s.date === selectedDateStr).sort((a, b) => a.time_str.localeCompare(b.time_str));

  return (
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4 min-h-[calc(100vh-6rem)] flex flex-col relative font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100/40 via-purple-50/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/40 via-cyan-50/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10 -translate-x-1/4 translate-y-1/4"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 relative z-10">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight flex items-center gap-3">
            03 คิวหัวหน้า
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">จัดการตารางนัดหมายและปฏิทินงาน</p>
        </div>
        <button
          onClick={openAddModal}
          className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <span className="text-xl group-hover:rotate-90 transition-transform">➕</span>
          <span className="font-bold">เพิ่มคิวงาน</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* ปฏิทิน */}
        <div className="lg:col-span-7 bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-xl shadow-indigo-100/50 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800">
              {currentMonth.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-3 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                <span className="text-xl font-bold leading-none">◀</span>
              </button>
              <button onClick={() => {
                const today = new Date();
                setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                setSelectedDate(today);
              }} className="px-4 py-2 rounded-full hover:bg-slate-100 text-slate-600 font-bold transition-colors">
                วันนี้
              </button>
              <button onClick={nextMonth} className="p-3 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                <span className="text-xl font-bold leading-none">▶</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
              <div key={day} className={`text-center font-bold text-sm py-2 ${day === 'อา' ? 'text-rose-500' : 'text-slate-400'}`}>
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 flex-1">
            {days.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="p-2"></div>;
              
              const dateStr = formatDateString(date);
              const isSelected = selectedDateStr === dateStr;
              const isToday = todayStr === dateStr;
              const daySchedules = schedules.filter(s => s.date === dateStr);
              const hasSchedules = daySchedules.length > 0;
              const isSunday = date.getDay() === 0;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    relative h-20 sm:h-24 rounded-2xl p-2 flex flex-col items-center justify-start border transition-all
                    ${isSelected ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200 scale-105 z-10' : 
                      isToday ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 
                      'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}
                  `}
                >
                  <span className={`
                    text-lg font-bold mt-1
                    ${isSelected ? 'text-white' : 
                      isSunday ? 'text-rose-500' : 
                      isToday ? 'text-blue-600' : 'text-slate-700'}
                  `}>
                    {date.getDate()}
                  </span>
                  
                  {/* แสดงจุดเมื่องาน */}
                  {hasSchedules && (
                    <div className="flex flex-wrap justify-center gap-1 mt-2 px-1">
                      {daySchedules.slice(0, 3).map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`}></div>
                      ))}
                      {daySchedules.length > 3 && (
                        <div className={`w-2 h-2 rounded-full flex items-center justify-center text-[8px] font-bold ${isSelected ? 'text-white' : 'text-indigo-500'}`}>+</div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* รายละเอียดงาน */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="bg-gradient-to-br from-slate-800 to-indigo-900 rounded-t-[2.5rem] p-8 text-white">
            <h3 className="text-xl text-indigo-200 font-medium mb-1">รายละเอียดงานประจำวันที่</h3>
            <h2 className="text-3xl font-black">{formatThaiDate(selectedDateStr)}</h2>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl border border-t-0 border-white/50 rounded-b-[2.5rem] p-6 shadow-xl shadow-indigo-100/50 flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : selectedSchedules.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">ไม่มีคิวนัดหมาย</h3>
                <p className="text-slate-500">วันนี้หัวหน้ายังไม่มีกำหนดการใดๆ</p>
                <button 
                  onClick={openAddModal}
                  className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-full hover:bg-indigo-100 transition-colors"
                >
                  + เพิ่มนัดหมายวันนี้
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedSchedules.map((schedule) => (
                  <div key={schedule.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {schedule.time_str}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(schedule)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="แก้ไข">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(schedule.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="ลบ">
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-slate-800 mb-3">{schedule.topic}</h4>
                    
                    <div className="space-y-2 text-sm">
                      {schedule.location && (
                        <div className="flex items-start gap-2 text-slate-600">
                          <span className="shrink-0 mt-0.5 text-rose-500">📍</span>
                          <span><span className="font-bold text-slate-700">สถานที่:</span> {schedule.location}</span>
                        </div>
                      )}
                      {schedule.meal && (
                        <div className="flex items-start gap-2 text-slate-600">
                          <span className="shrink-0 mt-0.5 text-amber-500">☕</span>
                          <span><span className="font-bold text-slate-700">มื้อฉัน:</span> {schedule.meal}</span>
                        </div>
                      )}
                      {schedule.driver && (
                        <div className="flex items-start gap-2 text-slate-600">
                          <span className="shrink-0 mt-0.5 text-blue-500">👤</span>
                          <span><span className="font-bold text-slate-700">คนขับ:</span> {schedule.driver}</span>
                        </div>
                      )}
                      {schedule.note && (
                        <div className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg mt-2">
                          <span className="shrink-0 text-slate-400">📝</span>
                          <span className="text-slate-600">{schedule.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* เพิ่ม/แก้ไข Modal (Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className={`p-8 text-white relative shrink-0 ${editMode ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <span className="text-xl font-bold leading-none">✕</span>
              </button>
              <h2 className="text-2xl font-bold mb-2">{editMode ? 'แก้ไขคิวนัดหมาย' : 'เพิ่มคิวนัดหมายใหม่'}</h2>
              <p className="text-white/80">บันทึกข้อมูลตารางงาน สถานที่ มื้อฉัน และคนขับรถ</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
              <div className="space-y-6">
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">วันที่ <span className="text-rose-500">*</span></label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">เวลา <span className="text-rose-500">*</span></label>
                    <input 
                      type="time" 
                      required
                      value={formData.time_str}
                      onChange={(e) => setFormData({...formData, time_str: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">หัวข้องาน / กิจกรรม <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="เช่น ประชุมคณะกรรมการ..."
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">สถานที่</label>
                  <input 
                    type="text" 
                    placeholder="ระบุสถานที่..."
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">มื้อฉัน (ถ้ามี)</label>
                    <input 
                      type="text" 
                      placeholder="เช่น เช้า/เพล/น้ำปานะ"
                      value={formData.meal}
                      onChange={(e) => setFormData({...formData, meal: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">คนขับรถ (ถ้ามี)</label>
                    <input 
                      type="text" 
                      placeholder="ระบุชื่อคนขับ..."
                      value={formData.driver}
                      onChange={(e) => setFormData({...formData, driver: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">หมายเหตุเพิ่มเติม</label>
                  <textarea 
                    rows={3}
                    placeholder="รายละเอียดอื่นๆ..."
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  type="submit"
                  className={`w-full text-white font-bold py-4 rounded-2xl transition-colors shadow-lg text-lg ${
                    editMode 
                      ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                  }`}
                >
                  {editMode ? 'บันทึกการแก้ไข' : 'บันทึกคิวนัดหมาย'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
