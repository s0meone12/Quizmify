"use client"
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import React from 'react'

const Providers = ({ children }: ThemeProviderProps) => {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
    >
        <SessionProvider>{children}</SessionProvider>
    </NextThemesProvider>
  )
}

export default Providers