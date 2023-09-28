// ProtectedAuth.tsx
import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

interface ProtectedAuthProps {
  children: React.ReactNode
}

export function ProtectedAuth(props: ProtectedAuthProps) {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const checkAdminToken = () => {
    const AdminToken = localStorage.getItem('username')
    if (!AdminToken || AdminToken === 'undefined') {
      setIsLoggedIn(false)
      return navigate('/login')
    }
    setIsLoggedIn(true)
  }

  useEffect(() => {
    checkAdminToken()
  }, [])

  return <>{isLoggedIn ? props.children : null}</>
}
