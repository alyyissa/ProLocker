import React, { useEffect, useState } from 'react'
import Preloader from '../components/preloader/Preloader'

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);
  return (
    <div className='h-full w-full'>
      <Preloader show={loading}/>
      {!loading && (
        <div className="app-content">
          <h1>My App is Loaded 🎉</h1>
        </div>
      )}
    </div>
  )
}

export default Home
