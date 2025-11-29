import React, { useEffect, useState } from 'react'
import Preloader from '../components/preloader/Preloader'
import Hero from '../components/home/Hero';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);
  return (
    <div className='h-full w-full'>
      <Preloader show={loading}/>
      {!loading && (
        <Hero />
      )}
    </div>
  )
}

export default Home
