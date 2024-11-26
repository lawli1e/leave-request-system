import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    try {
        const leaveRequests = await prisma.leaveRequest.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return new NextResponse(JSON.stringify(leaveRequests), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching leave requests:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const leaveRequest = await prisma.leaveRequest.create({
            data: {
                fullName: body.fullName,
                departmentPosition: body.departmentPosition || '',
                email: body.email || '',
                phone: body.phone,
                leaveType: body.leaveType,
                reason: body.reason,
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                status: 'pending'
            }
        });
        return new NextResponse(JSON.stringify(leaveRequest), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error creating leave request:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}