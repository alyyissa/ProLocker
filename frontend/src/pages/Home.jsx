import React, { useEffect, useState } from 'react'
import Hero from '../components/home/Hero';
import Statistics from '../components/home/Statistics';
import Categories from '../components/home/Categories';
import Preloader from '../components/Preloader/Preloader';
import Map from '../components/home/Map';
import MostSold from '../components/home/MostSold';
import Services from '../components/home/Services';
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
      <Helmet>
         <title>ProLocker | Premium Store in South Lebanon</title>
        <meta
          name="description"
          content="ProLocker is a trusted retail store in South Lebanon offering premium products, competitive prices, and reliable customer service."
        />

        <meta
          name="keywords"
          content="ProLocker, store in South Lebanon, shop Lebanon, ProLocker shop, lockers store"
        />

        <meta property="og:title" content="ProLocker | Store in South Lebanon" />
        <meta
          property="og:description"
          content="Shop premium products at ProLocker, your trusted store in South Lebanon."
        />
        <meta property="og:type" content="website" />

        <meta name="author" content="ProLocker" />
      </Helmet>
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
