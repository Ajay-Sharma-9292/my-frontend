import Navbar from '@/components/Navbar'
import React from 'react'

const page = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen p-6 pt-20 bg-white/90 overflow-hidden">
            <h2 className="text-3xl font-bold mb-6 text-center text-pink-700">Your Order History</h2>
    </div>
    </>
  )
}

export default page