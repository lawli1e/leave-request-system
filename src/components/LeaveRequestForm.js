'use client';
import React, { useState } from 'react';

export default function LeaveRequestForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    departmentPosition: '',
    email: '',
    phone: '',
    leaveType: 'other',
    reason: '',
    startDate: '',
    endDate: ''
  });

  const [error, setError] = useState('');

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const today = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    // ตรวจสอบว่า endDate ต้องไม่น้อยกว่า startDate
    if (endDate < startDate) {
      setError('วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น');
      return false;
    }
  
    // ตรวจสอบวันที่ย้อนหลัง
    if (startDate < today) {
      setError('ไม่อนุญาตให้ลาย้อนหลัง');
      return false;
    }
  
    // ตรวจสอบการลาพักร้อน
    if (formData.leaveType === 'vacation') {
      // ต้องลาล่วงหน้า 3 วัน
      const diffTime = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
      if (diffTime < 3) {
        setError('กรณีลาพักร้อน ต้องลาล่วงหน้าอย่างน้อย 3 วัน');
        return false;
      }
  
      // ลาได้ไม่เกิน 2 วัน
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      if (duration > 2) {
        setError('กรณีลาพักร้อน ลาติดต่อกันได้ไม่เกิน 2 วัน');
        return false;
      }
    }
  
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('บันทึกข้อมูลสำเร็จ');
        // รีเซ็ตฟอร์ม
        setFormData({
          fullName: '',
          departmentPosition: '',
          email: '',
          phone: '',
          leaveType: 'other',
          reason: '',
          startDate: '',
          endDate: ''
        });
        window.location.reload();
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">แบบฟอร์มขอลาหยุด</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">ชื่อ - นามสกุล *</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-1">สังกัด/ตำแหน่ง</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.departmentPosition}
            onChange={(e) => setFormData({...formData, departmentPosition: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-1">อีเมล</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-1">เบอร์โทรศัพท์ *</label>
          <input
            type="tel"
            required
            className="w-full p-2 border rounded"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-1">ประเภทการลา *</label>
          <select
            required
            className="w-full p-2 border rounded"
            value={formData.leaveType}
            onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
          >
            <option value="sick">ลาป่วย</option>
            <option value="personal">ลากิจ</option>
            <option value="vacation">พักร้อน</option>
            <option value="other">อื่นๆ</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">สาเหตุการลา *</label>
          <textarea
            required
            className="w-full p-2 border rounded"
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block mb-1">วันที่เริ่มลา *</label>
            <input
            type="date"
            required
            min={getTodayString()} // เพิ่มบรรทัดนี้
            className="w-full p-2 border rounded"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
        </div>
          
            <div>
                <label className="block mb-1">ถึงวันที่ *</label>
                <input
                type="date"
                required
                min={formData.startDate || getTodayString()} // เพิ่มบรรทัดนี้
                className="w-full p-2 border rounded"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
            </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            บันทึกข้อมูล
          </button>
        </div>
      </form>
    </div>
  );
}