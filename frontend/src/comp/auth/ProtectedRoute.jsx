import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'
import { setAccessToken, removeAccessToken, setRefreshing } from '../../slices/authSlice'

function ProtectedRoute() {
  const dispatch = useDispatch()
  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;
  const accessToken = useSelector((state) => state.auth.accessToken)
  const isRefreshing = useSelector((state) => state.auth.isRefreshing)
  const [bootstrapped, setBootstrapped] = useState(false)

  useEffect(() => {
    if (accessToken || bootstrapped) return

    let canceled = false

    const restoreSession = async () => {
      dispatch(setRefreshing(true))
      try {
        const response = await axios.post(
          `${backendUrl}/auth/refresh-token`,
          {},
          { withCredentials: true }
        )
        dispatch(setAccessToken(response.data.accessToken))
      } catch (err) {
        console.log(err)
        dispatch(removeAccessToken())
      } finally {
        if (!canceled) {
          dispatch(setRefreshing(false))
          setBootstrapped(true)
        }
      }
    }

    restoreSession()
    console.log(accessToken)
    return () => {
      canceled = true
    }
  }, [accessToken, bootstrapped, dispatch])

  if (!accessToken && (isRefreshing || !bootstrapped)) {
    return <div>Loading...</div>
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: 'Please Login To Start Accessing' }}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute