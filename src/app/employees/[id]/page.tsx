"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Types
type Employee = {
  person_id: string;
  status: string;
  gender: string;
  title: string;
  first_name: string;
  last_name: string;
  monastic_name?: string;
  dob?: string;
  height?: number;
  phone?: string;
  line_id?: string;
  department?: string;
  date_joined?: string;
  secular_edu?: string;
  dhamma_edu?: string;
  bank?: string;
  account_name?: string;
  account_number?: string;
  food_allergy?: string;
  drug_allergy?: string;
  disease?: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<Partial<Employee>>({
    person_id: '',
    status: 'เธญเธธเธเธฒเธชเธ',
    gender: 'เธเธฒเธข',
    title: 'เธเธฒเธข',
    first_name: '',
    last_name: '',
    monastic_name: '',
    dob: '',
    height: undefined,
    phone: '',
    line_id: '',
    department: '',
    date_joined: '',
    secular_edu: '',
    dhamma_edu: '',
    bank: '',
    account_name: '',
    account_number: '',
    food_allergy: '',
    drug_allergy: '',
    disease: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/employees/`);
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/employees/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchEmployees();
        // Reset form
        setFormData({
          person_id: '',
          status: 'เธญเธธเธเธฒเธชเธ',
          gender: 'เธเธฒเธข',
          title: 'เธเธฒเธข',
          first_name: '',
          last_name: '',
          monastic_name: '',
          dob: '',
          height: undefined,
          phone: '',
          line_id: '',
          department: '',
          date_joined: '',
          secular_edu: '',
          dhamma_edu: '',
          bank: '',
          account_name: '',
          account_number: '',
          food_allergy: '',
          drug_allergy: '',
          disease: ''
        });
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const calculateAge = (dob: string | undefined) => {
    if (!dob) return '-';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = `${emp.first_name} ${emp.last_name} ${emp.person_id}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter ? emp.department === departmentFilter : true;
    return matchesSearch && matchesDept;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'เธเธฃเธฐ': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'เธจเธฃเธฑเธ—เธเธฒเธงเธฒเธช': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'เธญเธธเธเธฒเธชเธ': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'เธญเธธเธเธฒเธชเธดเธเธฒ': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">01 เธเธธเธเธฅเธฒเธเธฃ</h1>
            <p className="text-gray-600 mt-2 text-lg">เธเธฑเธ”เธเธฒเธฃเธเนเธญเธกเธนเธฅเธชเนเธงเธเธเธธเธเธเธฅเธเธญเธเธเธธเธเธฅเธฒเธเธฃเธเธญเธเธ—เธธเธเธฏ</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            เน€เธเธดเนเธกเธเธธเธเธฅเธฒเธเธฃ
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="เธเนเธเธซเธฒเธเธทเนเธญ, เธเธฒเธกเธชเธเธธเธฅ, เธซเธฃเธทเธญเธฃเธซเธฑเธช..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <select 
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none transition-shadow cursor-pointer"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">เธ—เธธเธเนเธเธเธ</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-4 px-6 font-semibold text-gray-600">เธฃเธซเธฑเธชเธเธฃเธฐเธเธณเธ•เธฑเธง</th>
                  <th className="py-4 px-6 font-semibold text-gray-600">เธเธทเนเธญ-เธเธฒเธกเธชเธเธธเธฅ</th>
                  <th className="py-4 px-6 font-semibold text-gray-600">เนเธเธเธ</th>
                  <th className="py-4 px-6 font-semibold text-gray-600">เน€เธเธญเธฃเนเนเธ—เธฃเธจเธฑเธเธ—เน</th>
                  <th className="py-4 px-6 font-semibold text-gray-600">เธชเธ–เธฒเธเธฐ</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 text-right">เธเธฒเธฃเธเธฑเธ”เธเธฒเธฃ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      เธเธณเธฅเธฑเธเนเธซเธฅเธ”เธเนเธญเธกเธนเธฅ...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      เนเธกเนเธเธเธเนเธญเธกเธนเธฅ
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.person_id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="py-4 px-6 text-gray-600 font-medium">{emp.person_id}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.first_name)}+${encodeURIComponent(emp.last_name)}&background=random&rounded=true`} 
                            alt={`${emp.first_name} ${emp.last_name}`}
                            className="w-10 h-10 rounded-full shadow-sm"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{emp.title} {emp.first_name} {emp.last_name}</p>
                            {emp.monastic_name && <p className="text-sm text-gray-500">{emp.monastic_name}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{emp.department || '-'}</td>
                      <td className="py-4 px-6 text-gray-600">{emp.phone || '-'}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(emp.status)}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link href={`/employees/${emp.person_id}`} className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors">
                          เธ”เธนเธเนเธญเธกเธนเธฅเธ—เธฑเนเธเธซเธกเธ”
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <h2 className="text-2xl font-bold text-gray-800">เน€เธเธดเนเธกเธเธธเธเธฅเธฒเธเธฃเนเธซเธกเน</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="add-employee-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section: เธเนเธญเธกเธนเธฅเธเธทเนเธเธเธฒเธ */}
                <section>
                  <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-100 pb-2 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    เธเนเธญเธกเธนเธฅเธเธทเนเธเธเธฒเธ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธฃเธซเธฑเธชเธเธธเธเธฅเธฒเธเธฃ *</label>
                      <input type="text" name="person_id" required value={formData.person_id} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธชเธ–เธฒเธเธฐ *</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                        <option value="เธญเธธเธเธฒเธชเธ">เธญเธธเธเธฒเธชเธ</option>
                        <option value="เธญเธธเธเธฒเธชเธดเธเธฒ">เธญเธธเธเธฒเธชเธดเธเธฒ</option>
                        <option value="เธเธฃเธฐ">เธเธฃเธฐ</option>
                        <option value="เธจเธฃเธฑเธ—เธเธฒเธงเธฒเธช">เธจเธฃเธฑเธ—เธเธฒเธงเธฒเธช</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เน€เธเธจ *</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                        <option value="เธเธฒเธข">เธเธฒเธข</option>
                        <option value="เธซเธเธดเธ">เธซเธเธดเธ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธเธณเธเธณเธซเธเนเธฒ *</label>
                      <select name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                        <option value="เธเธฒเธข">เธเธฒเธข</option>
                        <option value="เธเธฒเธ">เธเธฒเธ</option>
                        <option value="เธเธฒเธเธชเธฒเธง">เธเธฒเธเธชเธฒเธง</option>
                        <option value="เธเธฃเธฐ">เธเธฃเธฐ</option>
                        <option value="เธชเธฒเธกเน€เธ“เธฃ">เธชเธฒเธกเน€เธ“เธฃ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธเธทเนเธญ *</label>
                      <input type="text" name="first_name" required value={formData.first_name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธเธฒเธกเธชเธเธธเธฅ *</label>
                      <input type="text" name="last_name" required value={formData.last_name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธเธฒเธขเธฒ (เธ–เนเธฒเธกเธต)</label>
                      <input type="text" name="monastic_name" value={formData.monastic_name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธงเธฑเธเน€เธเธดเธ”</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                      {formData.dob && <p className="text-xs text-gray-500 mt-1">เธญเธฒเธขเธธ: {calculateAge(formData.dob)} เธเธต</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธชเนเธงเธเธชเธนเธ (เธเธก.)</label>
                      <input type="number" name="height" value={formData.height || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                  </div>
                </section>

                {/* Section: เธเนเธญเธกเธนเธฅเธ•เธดเธ”เธ•เนเธญเนเธฅเธฐเธญเธเธเนเธเธฃ */}
                <section>
                  <h3 className="text-lg font-semibold text-purple-700 border-b border-purple-100 pb-2 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    เธเนเธญเธกเธนเธฅเธ•เธดเธ”เธ•เนเธญเนเธฅเธฐเธญเธเธเนเธเธฃ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เน€เธเธญเธฃเนเนเธ—เธฃเธจเธฑเธเธ—เน</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Line ID</label>
                      <input type="text" name="line_id" value={formData.line_id} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เนเธเธเธ</label>
                      <input type="text" name="department" value={formData.department} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธงเธฑเธเธ—เธตเนเน€เธฃเธดเนเธกเธเธฒเธ</label>
                      <input type="date" name="date_joined" value={formData.date_joined} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                  </div>
                </section>

                {/* Section: เธเธฒเธฃเธจเธถเธเธฉเธฒเนเธฅเธฐเธเธฒเธฃเน€เธเธดเธ */}
                <section>
                  <h3 className="text-lg font-semibold text-green-700 border-b border-green-100 pb-2 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.22 4.624 1 1 0 01-.89.89 8.969 8.969 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    เธเธฒเธฃเธจเธถเธเธฉเธฒเนเธฅเธฐเธเธฒเธฃเน€เธเธดเธ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธเธฒเธฃเธจเธถเธเธฉเธฒเธ—เธฒเธเนเธฅเธ</label>
                      <input type="text" name="secular_edu" value={formData.secular_edu} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธเธฒเธฃเธจเธถเธเธฉเธฒเธ—เธฒเธเธเธฃเธฃเธก</label>
                      <input type="text" name="dhamma_edu" value={formData.dhamma_edu} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธเธเธฒเธเธฒเธฃ</label>
                      <input type="text" name="bank" value={formData.bank} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธเธทเนเธญเธเธฑเธเธเธต</label>
                      <input type="text" name="account_name" value={formData.account_name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">เน€เธฅเธเธเธฑเธเธเธต</label>
                      <input type="text" name="account_number" value={formData.account_number} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                  </div>
                </section>

                {/* Section: เธชเธธเธเธ เธฒเธ */}
                <section>
                  <h3 className="text-lg font-semibold text-rose-700 border-b border-rose-100 pb-2 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    เธชเธธเธเธ เธฒเธ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธเธฃเธฐเธงเธฑเธ•เธดเนเธเนเธญเธฒเธซเธฒเธฃ</label>
                      <input type="text" name="food_allergy" value={formData.food_allergy} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="เนเธกเนเธกเธต/เธฃเธฐเธเธธ..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เธเธฃเธฐเธงเธฑเธ•เธดเนเธเนเธขเธฒ</label>
                      <input type="text" name="drug_allergy" value={formData.drug_allergy} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="เนเธกเนเธกเธต/เธฃเธฐเธเธธ..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เนเธฃเธเธเธฃเธฐเธเธณเธ•เธฑเธง</label>
                      <input type="text" name="disease" value={formData.disease} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="เนเธกเนเธกเธต/เธฃเธฐเธเธธ..." />
                    </div>
                  </div>
                </section>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                เธขเธเน€เธฅเธดเธ
              </button>
              <button 
                type="submit"
                form="add-employee-form"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-full shadow hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                เธเธฑเธเธ—เธถเธเธเนเธญเธกเธนเธฅ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Basic keyframes for decorative animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8; 
        }
      `}} />
    </div>
  );
}
