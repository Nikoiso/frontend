import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import MobileNav from "./MobileNav";
import { useSocket } from "@/hooks/useSocket";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSocket();
  return (
    <div className="mx-auto flex min-h-screen max-w-[1300px]">
      <Sidebar />

      <main className="min-h-screen w-full max-w-[600px] border-x border-gray-200">
        {children}
      </main>

      <RightSidebar />

      <MobileNav />
    </div>
  );
}
