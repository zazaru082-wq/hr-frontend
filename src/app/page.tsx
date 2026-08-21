"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';

export default function Home() {
  const [stats, setStats] = useState<any>({
    totalEmployees: 0,
    leaveToday: { total: 0, sick: 0, personal: 0, dharma: 0 },
    dharmaStats: { once: 0, twice: 0, none: 0 },
    schedules: [],
    projects: { active: 0, completed: 0, paused: 0 },
    birthdays: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        
        // Fetch all necessary data
        const [empRes, leaveRes, schedRes, projRes, perfRes] = await Promise.all([
          fetch(`${API_URL}/api/employees/`),
          fetch(`${API_URL}/api/leaves/`),
          fetch(`${API_URL}/api/schedules/`),
          fetch(`${API_URL}/api/projects/`),
          fetch(`${API_URL}/api/performances/`)
        ]);

        const employees = empRes.ok ? await empRes.json() : [];
        const leaves = leaveRes.ok ? await leaveRes.json() : [];
        const schedules = schedRes.ok ? await schedRes.json() : [];
        const projects = projRes.ok ? await projRes.json() : [];
        const performances = perfRes.ok ? await perfRes.json() : [];

        // 1. Employees & Birthdays
        const totalEmployees = employees.length;
        const currentMonth = new Date().getMonth() + 1; // 1-12
        const birthdays = employees.filter((emp: any) => {
          if (!emp.dob) return false;
          const dobDate = new Date(emp.dob);
          return (dobDate.getMonth() + 1) === currentMonth;
        }).map((emp: any) => ({
          name: `${emp.first_name} ${emp.last_name}`,
          department: emp.department || 'ไม่ระบุ',
          date: new Date(emp.dob).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
        }));

        // 2. Leave Today
        const todayStr = new Date().toISOString().split('T')[0];
        const leavesToday = leaves.filter((l: any) => 
          l.status === 'อนุมัติแล้ว' && 
          l.start_date <= todayStr && 
          l.end_date >= todayStr
        );
        
        const leaveTodayStats = {
          total: leavesToday.length,
          sick: leavesToday.filter((l: any) => l.leave_type === 'ลาป่วย').length,
          personal: leavesToday.filter((l: any) => l.leave_type === 'ลากิจ').length,
          dharma: leavesToday.filter((l: any) => l.leave_type === 'ลาปฏิบัติธรรม').length,
        };

        // 3. Dharma Stats (Count dharma leaves per person in the current year)
        const currentYear = new Date().getFullYear();
        const dharmaCounts: any = {};
        employees.forEach((e: any) => dharmaCounts[e.person_id] = 0);
        
        leaves.filter((l: any) => l.leave_type === 'ลาปฏิบัติธรรม' && l.status === 'อนุมัติแล้ว' && l.start_date.startsWith(currentYear.toString())).forEach((l: any) => {
            if (dharmaCounts[l.person_id] !== undefined) {
                dharmaCounts[l.person_id] += 1;
            }
        });
        
        let once = 0, twice = 0, none = 0;
        Object.values(dharmaCounts).forEach((count: any) => {
            if (count === 0) none++;
            else if (count === 1) once++;
            else twice++;
        });

        // 4. Schedules Today
        const schedulesToday = schedules.filter((s: any) => s.date === todayStr).sort((a: any, b: any) => a.time_str.localeCompare(b.time_str));

        // 5. Projects
        const projStats = {
          active: projects.filter((p: any) => p.status === 'กำลังทำ').length,
          completed: projects.filter((p: any) => p.status === 'เสร็จแล้ว').length,
          paused: projects.filter((p: any) => p.status === 'พัก/เลื่อน').length,
        };

        // 6. Recent Activity (Latest 3 performances)
        const recentActivity = performances
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
            .map((p: any) => ({
                id: p.id,
                title: `ผลงาน: ${p.topic}`,
                desc: p.activity,
                time: new Date(p.date).toLocaleDateString('th-TH')
            }));

        setStats({
          totalEmployees,
          leaveToday: leaveTodayStats,
          dharmaStats: { once, twice, none },
          schedules: schedulesToday,
          projects: projStats,
          birthdays,
          recentActivity
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalProjects = stats.projects.active + stats.projects.completed + stats.projects.paused || 1; // avoid div by 0

  if (loading) {
      return (
          <div className="flex items-center justify-center h-full min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
      );
  }

  const thMonth = new Date().toLocaleDateString('th-TH', { month: 'long' });

  return (
    <div className="space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-4 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">สวัสดี, Admin 👋</h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">ภาพรวมระบบบุคลากรกองทุนนฤมิตศิลป์</p>
        </div>
        <div className="flex gap-4">
          <Link href="/employees">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 font-bold flex items-center gap-2">
                <span className="text-xl leading-none">+</span> พนักงานใหม่
            </button>
          </Link>
        </div>
      </div>
      
      {/* --- Row 1: Top Metrics --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Personnel */}
        <Link href="/employees">
            <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-6 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 group cursor-pointer justify-center h-full">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100">👥</div>
                <div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">บุคลากรทั้งหมด</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-black text-slate-800">{stats.totalEmployees}</p>
                    <p className="text-sm text-slate-400 font-semibold">คน</p>
                </div>
                </div>
            </div>
            </div>
        </Link>
        
        {/* Leave Today Breakdown */}
        <Link href="/leave">
            <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-xl hover:shadow-sky-100 transition-all duration-300 group cursor-pointer justify-center h-full">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-sky-100">🏖️</div>
                <div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">ลางานวันนี้</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-black text-sky-500">{stats.leaveToday.total}</p>
                    <p className="text-sm text-slate-400 font-semibold">คน</p>
                </div>
                </div>
            </div>
            {/* Detailed Breakdown */}
            <div className="flex gap-2 text-xs font-bold mt-1">
                <span className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg border border-rose-100 flex-1 text-center">ลาป่วย {stats.leaveToday.sick}</span>
                <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg border border-amber-100 flex-1 text-center">ลากิจ {stats.leaveToday.personal}</span>
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100 flex-1 text-center">ปฏิบัติธรรม {stats.leaveToday.dharma}</span>
            </div>
            </div>
        </Link>

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
              <span className="text-sm font-black text-amber-600">{stats.dharmaStats.once} คน</span>
            </div>
            <div className="flex justify-between items-center bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-600">เข้าครบแล้ว 2 ครั้ง</span>
              <span className="text-sm font-black text-emerald-700">{stats.dharmaStats.twice} คน</span>
            </div>
            <div className="flex justify-between items-center bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              <span className="text-xs font-bold text-rose-600">ยังไม่ได้เข้า</span>
              <span className="text-sm font-black text-rose-700">{stats.dharmaStats.none} คน</span>
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
            <Link href="/appointments"><button className="text-sm font-bold text-blue-600 hover:underline">ดูทั้งหมด ➔</button></Link>
          </div>
          <div className="space-y-4 flex-1">
            {stats.schedules.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    ไม่มีคิวนัดหมายสำหรับวันนี้
                </div>
            ) : (
                stats.schedules.map((s: any, idx: number) => {
                    const dateObj = new Date(s.date);
                    const day = dateObj.toLocaleDateString('th-TH', { day: 'numeric' });
                    const month = dateObj.toLocaleDateString('th-TH', { month: 'short' });
                    return (
                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-blue-600">
                                <span className="text-[10px] font-bold uppercase">{month}</span>
                                <span className="text-xl font-black leading-none">{day}</span>
                                </div>
                                <div>
                                <p className="font-bold text-slate-800 text-lg">{s.topic}</p>
                                <p className="text-sm text-slate-500 mt-1 font-medium">{s.time_str} • {s.location || 'ไม่ระบุสถานที่'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 text-xs font-bold rounded-lg border inline-block mb-1 ${
                                    s.status === 'เสร็จสิ้น' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    s.status === 'ยกเลิก' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                    'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>{s.status}</span>
                                {(s.meal || s.driver) && (
                                    <p className="text-[10px] text-slate-400 font-bold">
                                        {[s.meal, s.driver ? `รถ: ${s.driver}` : null].filter(Boolean).join(' • ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">ความเคลื่อนไหวล่าสุด</h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {stats.recentActivity.length === 0 ? (
                <div className="text-center text-slate-400 text-sm">ไม่มีความเคลื่อนไหว</div>
            ) : (
                stats.recentActivity.map((act: any, idx: number) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-amber-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] bg-white border border-slate-100">
                            <div className="flex items-center justify-between mb-1">
                                <time className="text-[10px] font-bold text-amber-500 uppercase">{act.time}</time>
                            </div>
                            <div className="text-sm font-bold text-slate-800">{act.title}</div>
                            <div className="text-xs text-slate-500 mt-1">{act.desc}</div>
                        </div>
                    </div>
                ))
            )}
            
          </div>
          <Link href="/performances">
            <button className="w-full mt-6 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors">ดูทั้งหมด</button>
          </Link>
        </div>
      </div>

      {/* --- Row 3: Projects & Birthdays --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><span className="text-2xl">📁</span> สถานะโครงการภาพรวม</h3>
            <Link href="/projects">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-100">ทั้งหมด {stats.projects.active + stats.projects.completed + stats.projects.paused} โครงการ</span>
            </Link>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-blue-600">กำลังทำ ({stats.projects.active})</span>
                <span className="text-slate-400">{Math.round((stats.projects.active/totalProjects)*100)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(stats.projects.active/totalProjects)*100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-emerald-600">เสร็จแล้ว ({stats.projects.completed})</span>
                <span className="text-slate-400">{Math.round((stats.projects.completed/totalProjects)*100)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(stats.projects.completed/totalProjects)*100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-amber-600">พัก / เลื่อน ({stats.projects.paused})</span>
                <span className="text-slate-400">{Math.round((stats.projects.paused/totalProjects)*100)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${(stats.projects.paused/totalProjects)*100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Birthdays */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-500">🎂</div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-xl font-black text-rose-600 flex items-center gap-2">วันเกิดบุคลากร ({thMonth})</h3>
            <span className="bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg">{stats.birthdays.length} คน</span>
          </div>
          <div className="space-y-4 relative z-10">
            {stats.birthdays.length === 0 ? (
                <div className="text-center py-6 text-slate-400 font-medium">ไม่มีบุคลากรที่เกิดในเดือนนี้</div>
            ) : (
                stats.birthdays.map((b: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-white border border-rose-100/50">
                        <div className="w-12 h-12 bg-rose-500 text-white font-black flex items-center justify-center rounded-full shadow-lg shadow-rose-200">
                            {b.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-extrabold text-slate-800 text-sm">{b.name}</h4>
                            <p className="text-xs text-rose-500 font-semibold mt-0.5">{b.department} • {b.date}</p>
                        </div>
                        <div className="text-2xl animate-bounce">🎉</div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
