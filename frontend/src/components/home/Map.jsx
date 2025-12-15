import React from 'react'
import Title from '../Title'

const Map = () => {
  return (
    <>
        <Title 
        title='Find Us Here'
        subtitle='Visit Us in Our Store'
        />
        <div className="min-h-[300px] w-full mt-3" data-aos="fade-up" data-aos-delay="300">
            <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1501.8309530950376!2d35.5118759013247!3d33.866560896667515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f1772f0a21219%3A0x92f7948b53648eb2!2sKanj%20Clinic!5e0!3m2!1sen!2slb!4v1756735437815!5m2!1sen!2slb"
            className="w-full h-full min-h-[350px]"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            ></iframe>
        </div>
    </>
  )
}

export default Map
