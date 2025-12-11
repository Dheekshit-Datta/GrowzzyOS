import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Overview } from '@/components/dashboard/Overview';

export default function DashboardPage() {
  return (
    <DashboardLayout activeTab="overview">
      <Overview />
    </DashboardLayout>
  );
}
