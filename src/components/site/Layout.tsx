import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Static background blobs — no animation, no live blur (cheap painted gradient) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        <div className="blob-static blob-pink absolute -top-32 -left-32 w-96 h-96" />
        <div className="blob-static blob-mint absolute top-1/3 -right-32 w-[28rem] h-[28rem]" />
        <div className="blob-static blob-lavender absolute bottom-0 left-1/4 w-[22rem] h-[22rem]" />
      </div>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
