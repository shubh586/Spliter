import React from 'react';
import { ReactNode } from 'react';
const Layout = ({children}:{children:ReactNode}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {
        children
      }
    </div>
  );
}

export default Layout;
