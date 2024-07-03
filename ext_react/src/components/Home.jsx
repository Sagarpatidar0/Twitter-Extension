import React, { useContext } from 'react'
import useAuth from '../hook/useAuth';
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const {authData, loading, error} = useAuth();
  const {isAuthenticated} = useContext(AuthContext);
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {isAuthenticated && !loading ? (
        <div>
          <h1>Welcome {authData.id}</h1>
          <p>Your email is {authData.email}</p>
        </div>
      ): (!loading && !error && !isAuthenticated && <p>Please login</p>
      )}
    </div>
  )
}
