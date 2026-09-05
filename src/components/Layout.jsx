import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 py-4">
        <div className="card p-0 overflow-hidden bg-grid">
          <Navbar />
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
            <div className="border-r border-white/10">
              <Sidebar />
            </div>
            <div className="p-5">{children}</div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
