import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Pinboard — ideas for every part of your life",
  description: "A faster, calmer Pinterest alternative with public browsing, boards, reels and no ads.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)] pb-20 pt-16 md:pb-0">{children}</main>
          <Toaster position="bottom-center" toastOptions={{ duration: 2500 }} />
        </AuthProvider>
      </body>
    </html>
  );
}
