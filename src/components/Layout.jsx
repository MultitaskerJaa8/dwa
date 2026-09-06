import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="surface rounded-3xl overflow-hidden">
          <Navbar onMenu={() => setOpen(true)} />

          {/* Mobile Drawer */}
          {open && (
            <div className="fixed inset-0 z-[60] lg:hidden">
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl">
                <Sidebar onNavigate={() => setOpen(false)} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[310px_1fr]">
            <aside className="hidden lg:block bg-white border-r" style={{ borderColor: "var(--border)" }}>
              <Sidebar />
            </aside>

            <main className="bg-slate-50">
              <div className="p-5 md:p-7">{children}</div>
            </main>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}