import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 py-3">
        <div className="card p-0 overflow-hidden">
          <Navbar />
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
            <div className="border-r border-white/10 bg-white/0">
              <Sidebar />
            </div>
            <div className="p-4">{children}</div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}