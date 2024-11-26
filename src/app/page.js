import LeaveRequestForm from '@/components/LeaveRequestForm';
import LeaveRequestList from '@/components/LeaveRequestList';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ระบบลาหยุด</h1>
      <LeaveRequestForm />
      <LeaveRequestList />
    </main>
  );
}