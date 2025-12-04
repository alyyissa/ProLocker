import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css';

const Title = ({title, subtitle}) => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false, // animate every time element enters the viewport
        });
        }, []);
return (
    <div className={`flex flex-col justify-center items-center text-center`}>
        <h1 className='font-semibold text-3xl md:text-[35px] text-primary mb-2 ultra-regular' data-aos="fade-up" data-aos-delay="200">{title}</h1>
        <p className='text:sm md:text-base text-coprimary mt-2 max-w-156 text-[18px]' data-aos="fade-up" data-aos-delay="200">{subtitle}</p>
    </div>
)
}

export default Title
