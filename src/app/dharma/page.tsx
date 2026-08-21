export default function DharmaPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">ระบบปฏิบัติธรรม</h2>
          <p className="text-slate-500 mt-3 text-lg font-medium">จัดการรอบการปฏิบัติธรรมและติดตามการเข้าร่วมของพนักงาน</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 font-bold flex items-center gap-2">
          <span className="text-xl leading-none">+</span> สร้างรอบปฏิบัติธรรม
        </button>
      </div>

      <div className="bg-sky-50 border border-sky-100 p-6 rounded-2xl flex gap-4 items-start shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/50 rounded-full blur-2xl -mt-10 -mr-10"></div>
        <div className="text-sky-500 text-2xl mt-0.5 relative z-10">ℹ️</div>
        <div className="relative z-10">
          <h4 className="text-sky-900 font-bold text-lg">เงื่อนไขและนโยบายของระบบ</h4>
          <p className="text-sky-800/80 mt-1 font-medium">พนักงาน 1 ท่าน สามารถจองเข้าร่วมปฏิบัติธรรมได้ <strong className="text-sky-900">ไม่เกิน 2 ครั้งต่อปี</strong> ระบบจะทำการตรวจสอบประวัติอัตโนมัติเมื่อพนักงานกดจอง</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shadow-sm border border-blue-100">🧘</span>
          รอบปฏิบัติธรรมที่เปิดให้จอง (ประจำปี 2026)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-blue-50 transition-all duration-500 flex flex-col h-full group">
            <div className="h-3 bg-gradient-to-r from-blue-500 to-sky-400"></div>
            <div className="p-8 flex flex-col flex-1 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="flex justify-between items-start mb-6">
                <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-100 shadow-sm">กำลังเปิดรับสมัคร</span>
                <span className="text-slate-400 text-sm font-bold bg-slate-50 px-3 py-1 rounded-lg">รุ่นที่ 1</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">โครงการสมาธิเพื่อการทำงานเพิ่มประสิทธิภาพ</h4>
              
              <div className="space-y-4 mt-6 mb-8">
                <div className="flex items-start gap-4 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-lg">📅</span>
                  <div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-0.5">วันที่จัดกิจกรรม</p>
                    <p className="text-slate-800 font-bold">15 - 17 ก.ย. 2026 (3 วัน 2 คืน)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-lg">📍</span>
                  <div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-0.5">สถานที่</p>
                    <p className="text-slate-800 font-bold">ศูนย์ปฏิบัติธรรมเขาใหญ่ จ.นครราชสีมา</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="mb-3 flex justify-between text-sm items-end">
                  <span className="text-slate-500 font-bold">ยอดผู้เข้าร่วม</span>
                  <span className="text-slate-900 font-black text-lg">12 <span className="text-slate-400 text-sm font-medium">/ 30 คน</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-8 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-sky-400 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
                
                <button className="w-full py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 font-bold transition-all shadow-sm">
                  ดูรายชื่อ & จัดการข้อมูล
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden opacity-70 flex flex-col h-full grayscale-[20%] hover:grayscale-0 transition-all duration-500 group">
            <div className="h-3 bg-slate-300"></div>
            <div className="p-8 flex flex-col flex-1 relative">
              <div className="flex justify-between items-start mb-6">
                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 shadow-sm">ปิดรับสมัคร (เต็มแล้ว)</span>
                <span className="text-slate-400 text-sm font-bold bg-slate-50 px-3 py-1 rounded-lg">รุ่นพิเศษ</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2 leading-snug">คอร์สวิปัสสนาสำหรับผู้บริหาร</h4>
              
              <div className="space-y-4 mt-6 mb-8">
                <div className="flex items-start gap-4 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-lg">📅</span>
                  <div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-0.5">วันที่จัดกิจกรรม</p>
                    <p className="text-slate-800 font-bold">1 - 5 ต.ค. 2026 (5 วัน)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-lg">📍</span>
                  <div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-0.5">สถานที่</p>
                    <p className="text-slate-800 font-bold">วัดป่านานาชาติ จ.อุบลราชธานี</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="mb-3 flex justify-between text-sm items-end">
                  <span className="text-slate-500 font-bold">ยอดผู้เข้าร่วม</span>
                  <span className="text-slate-900 font-black text-lg">15 <span className="text-slate-400 text-sm font-medium">/ 15 คน</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-8 overflow-hidden">
                  <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                
                <button className="w-full py-3.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 font-bold transition-all shadow-sm">
                  ดูรายชื่อสรุป
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
