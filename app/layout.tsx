import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "sonner";
import "@/styles/global.css";
import { Web3Provider } from "@/context/web3";
import { AuthProvider } from "@/context/auth";
import { SITE_DESCRIPTION, SITE_NAME, WALLETCONNECT_CONFIG } from "@/lib/const";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { Layout } from "@/components/layout";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
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
          <AuthProvider>
            <Theme>
              <Layout>
                {children}
                <Toaster expand />
              </Layout>
            </Theme>
          </AuthProvider>
        </Web3Provider>
      </body>
    </html>
  );
}

