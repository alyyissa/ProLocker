import React, { useEffect, useState } from 'react'
import Hero from '../components/home/Hero';
import Statistics from '../components/home/Statistics';
import Categories from '../components/home/Categories';

const Home = () => {
  return (
    <>
      <Hero />
      <Statistics />
      <Categories />
    </>
  )
}

export default Home
