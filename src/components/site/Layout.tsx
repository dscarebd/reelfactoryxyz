import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob bg-pink absolute -top-32 -left-32 w-96 h-96 animate-blob" />
        <div className="blob bg-mint absolute top-1/3 -right-32 w-[28rem] h-[28rem] animate-blob" style={{ animationDelay: "2s" }} />
        <div className="blob bg-lavender absolute bottom-0 left-1/4 w-[22rem] h-[22rem] animate-blob" style={{ animationDelay: "5s" }} />
      </div>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
