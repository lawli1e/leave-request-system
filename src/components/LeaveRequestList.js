'use client';
import { useEffect, useState } from 'react';

export default function LeaveRequestList() {
  const [requests, setRequests] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/leave-requests');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      // เรียงลำดับข้อมูลตาม sortOrder
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
      setRequests(sortedData);
      setError(null);
    } catch (error) {
      setError('Failed to load leave requests');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [sortOrder]);
  
  if (loading) {
    return <div className="text-center py-4">กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  const filteredRequests = requests.filter(request => {
    const matchName = request.fullName.toLowerCase().includes(searchName.toLowerCase());
    const matchDate = !searchDate || request.startDate.includes(searchDate);
    return matchName && matchDate;
  });

  const handleDelete = async (id) => {
    if (confirm('ยืนยันการลบข้อมูล?')) {
      try {
        const response = await fetch(`/api/leave-requests/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          // โหลดข้อมูลใหม่หลังลบสำเร็จ
          fetchRequests();
        }
      } catch (error) {
        setError('Failed to delete request');
      }
    }
  };
  
  const handleStatusUpdate = async (id, newStatus) => {
    if (confirm(`ยืนยันการ${newStatus === 'approved' ? 'อนุมัติ' : 'ไม่อนุมัติ'}?`)) {
      try {
        const response = await fetch(`/api/leave-requests/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
          // โหลดข้อมูลใหม่หลังอัพเดทสำเร็จ
          fetchRequests();
        }
      } catch (error) {
        setError('Failed to update status');
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">รายการขอลาหยุด</h2>
      {/* ส่วนค้นหาและเรียงลำดับ */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="ค้นหาตามชื่อ..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="p-2 border rounded"
        />
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="desc">ล่าสุดก่อน</option>
          <option value="asc">เก่าสุดก่อน</option>
        </select>
      </div>

      {/* ตารางแสดงข้อมูล */}
      {filteredRequests.length === 0 ? (
        <p className="text-center py-4">ไม่มีข้อมูลการลา</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ชื่อ-นามสกุล</th>
                <th className="border p-2">ประเภทการลา</th>
                <th className="border p-2">วันที่ลา</th>
                <th className="border p-2">สถานะ</th>
              </tr>
            </thead>
                <tbody>
                    {filteredRequests.map((request) => (
                        <tr key={request.id}>
                        <td className="border p-2">{request.fullName}</td>
                        <td className="border p-2">{request.leaveType}</td>
                        <td className="border p-2">
                                {new Date(request.startDate).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} - 
                                {new Date(request.endDate).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                        </td>
                        <td className="border p-2">
                            <span className={`px-2 py-1 rounded ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                            }`}>
                            {request.status === 'pending' ? 'รอพิจารณา' :
                            request.status === 'approved' ? 'อนุมัติ' : 'ไม่อนุมัติ'}
                            </span>
                        </td>
                        <td className="border p-2">
                            {/* ปุ่มอนุมัติ/ไม่อนุมัติ แสดงเฉพาะสถานะรอพิจารณา */}
                            {request.status === 'pending' && (
                            <div className="flex gap-2">
                                <button
                                onClick={() => handleStatusUpdate(request.id, 'approved')}
                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                อนุมัติ
                                </button>
                                <button
                                onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                ไม่อนุมัติ
                                </button>
                            </div>
                            )}
                            {/* ปุ่มลบ */}
                            <button
                            onClick={() => handleDelete(request.id)}
                            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 mt-1"
                            >
                            ลบ
                            </button>
                        </td>
                        </tr>
                    ))}
                </tbody>
          </table>
        </div>
      )}
    </div>
  );
}