import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RuleInspectorModal from "@/components/RuleInspectorModal";

export const metadata = {
  title: "BhuVikas AI (भू-विकास) | Building Regulations Intelligence Platform",
  description:
    "AI-powered Madhya Pradesh Bhumi Vikas Niyam intelligence platform. Instant rule limit checks, violation detection, exact clause citations, and evidence-grounded planning assistant.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <AuthProvider>
          <ChatProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <RuleInspectorModal />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
