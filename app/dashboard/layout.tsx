import Navigation from '@/components/shared/Navigation';
import DashboardProtect from '@/components/shared/DashboardProtect';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProtect>
      <Navigation />
      {children}
    </DashboardProtect>
  );
}
