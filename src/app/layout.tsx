import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const prompt = Prompt({ 
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-prompt'
});

export const metadata: Metadata = {
  title: "เธฃเธฐเธเธเธเธฃเธดเธซเธฒเธฃเธเธฒเธเธเธธเธเธเธฅ | เธเธญเธเธ—เธธเธเธเธคเธกเธดเธ•เธจเธดเธฅเธเน",
  description: "HR System for Niramitsilp Fund",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={prompt.variable}>
      <body className="bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-blue-500 selection:text-white">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6 md:p-10 ml-64 overflow-y-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
