"use client";

import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { getSignMessageTemplate } from "@/lib/utils/sign";
import dayjs from "dayjs";
import { SITE_NAME } from "@/lib/const";
import { useAccount, useSignMessage } from "wagmi";

interface AuthContextProps extends PropsWithChildren {
  defaultIsAuthenticated?: boolean;
}

export const AuthContext = createContext({
  isAuthenticated: false,
  login: async () => {
    return {
      success: false,
      error: "Not implemented"
    } as {
      success: boolean;
      error?: any;
    }
  },
});

export function useAuth() {
  return useContext(AuthContext);
}

const checkIsAuthenticated = async () => {
  return false;
}

const generateNonce = async () => {
  const response = await fetch("/api/auth/generate-nonce");
  const data = await response.json();
  return data.nonce;
};

const verifySignatrue = async (data: {
  address: string;
  signature: `0x${string}`;
  nonce: string;
  currentTime: string;
}) => {
  const response = await fetch("/api/auth/verify-signature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

function useLogin() {
  const { signMessageAsync } = useSignMessage();
  const account = useAccount();

  const login = async () => {
    if (!account.address) {
      console.warn("No account address found");
      return { success: false, error: "No account address found" }
    }

    try {
      const nonce = await generateNonce();

      const messageData = {
        message: `Sign this message to login to ${SITE_NAME}.`,
        address: account.address,
        nonce,
        currentTime: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      };

      const signature = await signMessageAsync(
        {
          message: getSignMessageTemplate(messageData)
        })

      await verifySignatrue({
        ...messageData,
        signature,
      })
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err?.message }
    }
  };
  return login;
}

export function AuthProvider({ children }: AuthContextProps) {
  const login = useLogin();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginAndSetIsAuthenticated = async () => {
    if (await checkIsAuthenticated()) {
      setIsAuthenticated(true);
      return {
        success: true
      }
    }
    const result = await login();
    setIsAuthenticated(result.success);
    return result;
  }

  return <AuthContext.Provider value={{ isAuthenticated, login: loginAndSetIsAuthenticated }}>
    {children}
  </AuthContext.Provider>;
}
