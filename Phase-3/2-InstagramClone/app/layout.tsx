import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Lumen — a calmer Instagram",
  description: "A chronological, ad-free photo and video community.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster position="bottom-center" toastOptions={{ duration: 2400 }} />
        </AuthProvider>
      </body>
    </html>
  );
}
