import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DateRangeProvider } from "@/contexts/DateRangeContext";
import { QueryProvider } from "@/contexts/QueryContext";
import { NavSidebar } from "@/components/layout/NavSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>
            <DateRangeProvider>
              <TooltipProvider>
                <div className="flex h-[100svh]">
                  <NavSidebar />
                  <ScrollArea className="flex-1">
                    <div className="flex-1 flex flex-col">
                      <main className="flex-1 bg-background dark:bg-gray-900 overflow-auto">
                        {children}
                      </main>
                    </div>
                  </ScrollArea>
                </div>
              </TooltipProvider>
            </DateRangeProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
