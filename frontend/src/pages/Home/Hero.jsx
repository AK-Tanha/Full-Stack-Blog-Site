import { Swiper, SwiperSlide } from 'swiper/react';
import Img1 from "../../assets/hero carosol images/img1.jpg";
import Img2 from "../../assets/hero carosol images/img2.jpg";
import Img3 from "../../assets/hero carosol images/img3.jpg";
import Img4 from "../../assets/hero carosol images/img4.jpg";
import Img5 from "../../assets/hero carosol images/img5.jpg";

import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

const Hero = () => {
  return (
    <div className='flex flex-col md:flex-row justify-between items-center gap-12'>
        <div  className='md:w-1/2 w-full text-center md:text-left'>
            <h1 className='md:text-5xl text-3xl font-bold md:leading-tight'>Welcome to <span className='text-blue-600'>Combat Corner</span> Bangladesh</h1>
            <p className='py-4'>Dedicated to MMA and boxing in Bangladesh. Focused on the growth and recognition of combat sports across the nation. Get insights into local events, fighter journeys, behind-the-scenes moments, and developments shaping the scene.</p>
        </div>

        <div className='md:w-1/2 w-full mx-auto bg-white p-4 rounded-xl shadow-lg'>
        <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{
            clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
            <img src={Img1} alt="" className='w-full lg:h-[420px] sm:h-96 h-80 rounded-xl object-cover' />
        </SwiperSlide>
        <SwiperSlide>
            <img src={Img2} alt="" className='w-full lg:h-[420px] sm:h-96 h-80 rounded-xl object-cover' />
        </SwiperSlide>
        <SwiperSlide>
            <img src={Img3} alt="" className='w-full lg:h-[420px] sm:h-96 h-80 rounded-xl object-cover' />
        </SwiperSlide>
        <SwiperSlide>
            <img src={Img4} alt="" className='w-full lg:h-[420px] sm:h-96 h-80 rounded-xl object-cover' />
        </SwiperSlide>
        <SwiperSlide>
            <img src={Img5} alt="" className='w-full lg:h-[420px] sm:h-96 h-80 rounded-xl object-cover' />
        </SwiperSlide>
      </Swiper>
        </div>
    </div>
  );
};

export default Hero;
