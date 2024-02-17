import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "sonner";
import { Web3Provider } from "@/context/web3";
import { AuthProvider } from "@/context/auth";
import { SITE_DESCRIPTION, SITE_NAME, WALLETCONNECT_CONFIG } from "@/lib/const";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { Layout } from "@/components/layout";
import { QueryClientProvider } from "@/context/query-client-provider";
import "@radix-ui/themes/styles.css";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(WALLETCONNECT_CONFIG, headers().get("cookie"));
  return (
    <html lang="en">
      <body>
        <Web3Provider initialState={initialState}>
          <QueryClientProvider>
          <AuthProvider>
            <Theme>
              <Layout>
                {children}
                <Toaster expand richColors />
              </Layout>
            </Theme>
          </AuthProvider>
          </QueryClientProvider>
        </Web3Provider>
      </body>
    </html>
  );
}

