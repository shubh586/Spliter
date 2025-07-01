
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Splitr",
  description: "The smartest way to split expenses with friends",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logos/logo-s.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <Header />
            <main className=" min-h-screen ">
              <Toaster />

              {children}
            </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
