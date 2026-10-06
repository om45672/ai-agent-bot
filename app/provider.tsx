"use client"

import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import axios from 'axios'
function Provider({ children }: { children: React.ReactNode }) {
    const {data} = useSession();
    useEffect(() => {
        if(data?.user?.email){
            createNewUser();
        }
    }, [data]);
    const createNewUser = async () => {
        try {
            const result = await axios.post('/api/user', {});
            console.log('User created successfully:', result.data);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
  return (
    <div className="flex flex-col h-screen">
      {children}
    </div>
  )
}

export default Provider