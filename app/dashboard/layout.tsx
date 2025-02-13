import React from 'react'
// import Navbar from '../components/layout/Navbar';

export const DashboardLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div className='w-full h-full'>
        {/* <Navbar /> */}
        <div className="flex h-full w-full">
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout