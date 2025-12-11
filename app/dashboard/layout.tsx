import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export const metadata = {
  title: 'Dashboard | Growzzy OS',
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The individual pages will set the activeTab prop
  return <>{children}</>;
}
