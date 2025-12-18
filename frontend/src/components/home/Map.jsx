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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d208.65842080898346!2d35.43258660486973!3d33.20007486794613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151e9b005a5b3f47%3A0x84767cb93d7c3b23!2sPro%20Locker!5e0!3m2!1sen!2slb!4v1766066882716!5m2!1sen!2slb"
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
