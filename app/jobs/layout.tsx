import React from 'react'
// import Navbar from '../components/layout/Navbar';

export default function Layout({ children } : Readonly<{
  children: React.ReactNode;
}>) 
 {
  return (
    <div className='w-full h-full'>
        {/* <Navbar /> */}
        <div className="flex h-full w-full">
            {children}
        </div>
    </div>
  )
}
