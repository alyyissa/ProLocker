import React, { useEffect, useState } from 'react'
import Hero from '../components/home/Hero';
import Statistics from '../components/home/Statistics';
import Categories from '../components/home/Categories';
import Preloader from '../components/Preloader/Preloader';
import Map from '../components/home/Map';
import MostSold from '../components/home/MostSold';
import Services from '../components/home/Services';

const Home = () => {
  return (
    <>
      <Hero />
      <Statistics />
      <Categories />
      <MostSold />
      <Services />
      <Map />
    </>
  )
}

export default Home
