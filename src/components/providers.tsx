"use client"
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react'

type Props = {
    children: React.ReactNode;
}

const Providers = ({children}: Props) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider>{children}</SessionProvider>
    </NextThemesProvider>
  )
}

export default Providers