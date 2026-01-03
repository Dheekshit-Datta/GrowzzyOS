import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FloatingAIChat } from '@/components/floating-ai-chat';

export const metadata = {
  title: 'Dashboard | Growzzy OS',
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <FloatingAIChat />
    </>
  );
}
