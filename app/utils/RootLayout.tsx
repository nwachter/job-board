"use client";
interface GlobalLayoutProps {
    children: React.ReactNode;
  }
import React from 'react'
import TanstackProvider from '../providers/TanstackProvider';

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
    return (
    <TanstackProvider>
      {children}
    </TanstackProvider>
  )
}

export default GlobalLayout  