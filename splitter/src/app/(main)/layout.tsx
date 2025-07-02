import React, { ReactNode } from 'react'

const Rootlayout = ({children}:{children:ReactNode}) => {
  return (
    <div className="container mx-auto mt-24 mb-20 px-4">
      {children}
    </div>
  )
}

export default Rootlayout