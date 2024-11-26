import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// API สำหรับลบข้อมูล
export async function DELETE(request, { params }) {
  try {
    await prisma.leaveRequest.delete({
      where: {
        id: parseInt(params.id)
      }
    });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete leave request' }, 
      { status: 500 }
    );
  }
}

// API สำหรับอัพเดทสถานะ
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    
    // ตรวจสอบว่ามี status มาหรือไม่
    if (!body.status) {
      return NextResponse.json(
        { error: 'Status is required' }, 
        { status: 400 }
      );
    }

    // อัพเดทข้อมูล
    const leaveRequest = await prisma.leaveRequest.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        status: body.status
      }
    });

    return NextResponse.json(leaveRequest);
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update leave request' }, 
      { status: 500 }
    );
  }
}