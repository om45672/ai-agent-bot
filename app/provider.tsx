"use client"

import { useSession } from 'next-auth/react'
import React from 'react'

function Provider({ children }: { children: React.ReactNode }) {
    const {data} = useSession();

    const createNewUser = async () => {
        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            const data = await response.json();
            console.log('User created successfully:', data);
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