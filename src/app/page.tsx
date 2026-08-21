export default function Home() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-4 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">สวัสดี, Admin 👋</h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">ภาพรวมระบบบุคลากรกองทุนนฤมิตศิลป์</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 font-bold flex items-center gap-2">
            <span className="text-xl leading-none">+</span> พนักงานใหม่
          </button>
        </div>
      </div>
      
      {/* --- Row 1: Top Metrics --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Personnel */}
        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-6 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 group cursor-pointer justify-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100">👥</div>
            <div>
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">บุคลากรทั้งหมด</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black text-slate-800">142</p>
                <p className="text-sm text-slate-400 font-semibold">คน</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Leave Today Breakdown */}
        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-xl hover:shadow-sky-100 transition-all duration-300 group cursor-pointer justify-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-sky-100">🏖️</div>
            <div>
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">ลางานวันนี้</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black text-sky-500">5</p>
                <p className="text-sm text-slate-400 font-semibold">คน</p>
              </div>
            </div>
          </div>
          {/* Detailed Breakdown */}
          <div className="flex gap-2 text-xs font-bold mt-1">
            <span className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg border border-rose-100 flex-1 text-center">ลาป่วย 2</span>
            <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg border border-amber-100 flex-1 text-center">ลากิจ 2</span>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100 flex-1 text-center">ปฏิบัติธรรม 1</span>
          </div>
        </div>

        {/* Dharma Stats */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 cursor-pointer flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-700 text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <span className="text-xl">🧘‍♂️</span> สถิติปฏิบัติธรรม
            </h3>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-1 rounded-lg font-bold">โควตา: 2 ครั้ง/ปี</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500">เข้าแล้ว 1 ครั้ง</span>
              <span className="text-sm font-black text-amber-600">45 คน</span>
            </div>
            <div className="flex justify-between items-center bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-600">เข้าครบแล้ว 2 ครั้ง</span>
              <span className="text-sm font-black text-emerald-700">12 คน</span>
            </div>
            <div className="flex justify-between items-center bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              <span className="text-xs font-bold text-rose-600">ยังไม่ได้เข้า</span>
              <span className="text-sm font-black text-rose-700">85 คน</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Row 2: Schedules & Activities --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leader's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><span className="text-2xl">📅</span> ตารางคิวหัวหน้า (วันนี้)</h3>
            <button className="text-sm font-bold text-blue-600 hover:underline">ดูทั้งหมด ➔</button>
          </div>
          <div className="space-y-4 flex-1">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-blue-600">
                   <span className="text-[10px] font-bold uppercase">ส.ค.</span>
                   <span className="text-xl font-black leading-none">20</span>
                 </div>
                 <div>
                   <p className="font-bold text-slate-800 text-lg">ประชุมกรรมการกองทุนฯ</p>
                   <p className="text-sm text-slate-500 mt-1 font-medium">09:00 - 11:00 • ห้องประชุม 1</p>
                 </div>
               </div>
               <div className="text-right">
                 <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg border border-amber-100 inline-block mb-1">กำลังดำเนินการ</span>
                 <p className="text-[10px] text-slate-400 font-bold">ฉันเช้า • รถ: คุณสมชาย</p>
               </div>
             </div>
             
             <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between opacity-60">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                   <span className="text-[10px] font-bold uppercase">ส.ค.</span>
                   <span className="text-xl font-black leading-none">20</span>
                 </div>
                 <div>
                   <p className="font-bold text-slate-500 text-lg line-through">ตรวจงานนิทรรศการ</p>
                   <p className="text-sm text-slate-400 mt-1 font-medium">13:00 - 15:00 • อาคารวิจิตรศิลป์</p>
                 </div>
               </div>
               <div className="text-right">
                 <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg border border-slate-200 inline-block mb-1">ยกเลิก</span>
               </div>
             </div>
          </div>
        </div>

        {/* Recent Activities (Merged Announcements + Merits + Performances) */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800">ความเคลื่อนไหวล่าสุด</h3>
          </div>
          <div className="space-y-6 flex-1">
            <div className="relative pl-4 border-l-2 border-amber-400">
              <span className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-amber-400"></span>
              <p className="text-[10px] font-black text-amber-500 uppercase mb-1">04 ผลงาน</p>
              <p className="font-bold text-slate-800 text-sm">เพิ่มผลงาน: สื่อธรรมะออนไลน์ (MV AI)</p>
              <p className="text-xs text-slate-400 mt-1">2 ชั่วโมงที่แล้ว</p>
            </div>
            
            <div className="relative pl-4 border-l-2 border-pink-400">
              <span className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-pink-400"></span>
              <p className="text-[10px] font-black text-pink-500 uppercase mb-1">08 ทบทวนบุญ</p>
              <p className="font-bold text-slate-800 text-sm">อัปโหลดภาพ: ถวายภัตตาหารเช้า</p>
              <p className="text-xs text-slate-400 mt-1">4 ชั่วโมงที่แล้ว</p>
            </div>
            
            <div className="relative pl-4 border-l-2 border-blue-500">
              <span className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-500"></span>
              <p className="text-[10px] font-black text-blue-500 uppercase mb-1">07 กติกา MV AI</p>
              <p className="font-bold text-slate-800 text-sm">ประกาศ: อัปเดตกติกาลิขสิทธิ์ใหม่</p>
              <p className="text-xs text-slate-400 mt-1">เมื่อวานนี้</p>
            </div>
          </div>
          <button className="w-full mt-4 py-3 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">ดูทั้งหมด</button>
        </div>
      </div>

      {/* --- Row 3: Projects & Birthdays --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Status */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><span className="text-2xl">📁</span> สถานะโครงการภาพรวม</h3>
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">ทั้งหมด 15 โครงการ</span>
          </div>
          
          <div className="space-y-5">
            {/* Progress Bars */}
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-blue-600">กำลังทำ (8)</span>
                <span className="text-slate-400">53%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '53%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-emerald-600">เสร็จแล้ว (5)</span>
                <span className="text-slate-400">33%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-amber-600">พัก / เลื่อน (2)</span>
                <span className="text-slate-400">14%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Birthdays */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-[2rem] shadow-sm border border-pink-100 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-9xl opacity-10 translate-x-4 -translate-y-4">🎂</div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-xl font-black text-pink-900 flex items-center gap-2">วันเกิดบุคลากร (สิงหาคม)</h3>
            <span className="bg-white text-pink-600 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">3 คน</span>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Wichai&background=f43f5e&color=fff&rounded=true&bold=true" className="w-12 h-12 rounded-full shadow-sm" alt="profile"/>
                <div>
                  <p className="font-bold text-slate-800">คุณวิชัย สุขใจ</p>
                  <p className="text-xs font-bold text-pink-500 mt-0.5">กองกลาง • 12 ส.ค.</p>
                </div>
              </div>
              <span className="text-2xl">🎉</span>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Ora&background=f43f5e&color=fff&rounded=true&bold=true" className="w-12 h-12 rounded-full shadow-sm" alt="profile"/>
                <div>
                  <p className="font-bold text-slate-800">น.ส. อรจิตต์ แซ่เอี้ยว</p>
                  <p className="text-xs font-bold text-pink-500 mt-0.5">MV AI • 29 ส.ค.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1.5 rounded-lg">เร็วๆ นี้</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
