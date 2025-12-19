import React from 'react'
import { assets } from '../../assets/assets'
import Title from '../Title'
import AOS from 'aos'
import 'aos/dist/aos.css';

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Fast Delivery",
      description: "Fast Delivery on all orders",
      image: assets.shippingIcon,
      alt: "Free Shipping"
    },
    {
      id: 2,
      title: "Service Guarantee",
      description: "Premium quality products",
      image: assets.serviceGuarentee,
      alt: "Service Guarantee"
    },
    {
      id: 3,
      title: "Easy Returns",
      description: "7-day hassle-free return policy",
      image: assets.returnImg,
      alt: "Easy Returns"
    },
    {
      id: 4,
      title: "Cash on Delivery",
      description: "Pay when you receive your order",
      image: assets.cod,
      alt: "Cash on Delivery"
    }
  ]

  return (
    <div className='w-full px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 py-8 md:py-12'>
      <Title 
      title='Our Services'
      subtitle='Enjoy a seamless shopping experience with our premium services'
      />
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-10' data-aos="fade-up" data-aos-delay="200">
        {services.map((service) => (
          <div 
            key={service.id} 
            className='flex flex-col items-center text-center p-4 md:p-6 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/50 backdrop-blur-sm'
          >
            <div className='mb-4 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl'>
              <img 
                src={service.image} 
                alt={service.alt} 
                className='w-14 h-14 md:w-18 md:h-18 object-contain'
              />
            </div>
            
            <h3 className='text-lg md:text-xl font-bold text-gray-900 mb-2'>
              {service.title}
            </h3>
            
            <p className='text-gray-600 text-sm md:text-base'>
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services