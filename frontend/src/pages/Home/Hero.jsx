import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useFetchBlogsQuery } from '../../redux/features/blogs/blogsApi';
const Hero = () => {
  const { data: blogs = [] } = useFetchBlogsQuery();
  
  const { t, i18n } = useTranslation();

  // Filter for featured blogs only
  const featuredBlogs = blogs.filter(blog => blog.is_featured);

  if (featuredBlogs.length === 0) {
    return null; 
  }
  return (
    <div className='relative w-full overflow-hidden rounded-2xl shadow-2xl bg-gray-900'>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay, Navigation]}
        className="hero-swiper h-[400px] md:h-[550px]"
      >
        {featuredBlogs.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className='relative w-full h-full group'>
              {/* Image with overlay */}
              <img 
                src={slide.coverImg} 
                alt={slide.title} 
                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />
              
              {/* Content */}
              <div className='absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-3/4 text-white'>
                <span className='inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase bg-blue-600 rounded-full font-outfit'>
                  {i18n.language === "bn" ? slide.category_bn || slide.category : slide.category}
                </span>
                <h2 className='text-3xl md:text-5xl font-outfit font-black mb-4 leading-tight drop-shadow-lg'>
                  {i18n.language === "bn" ? slide.title_bn || slide.title : slide.title}
                </h2>
                <p className='text-lg md:text-xl text-gray-200 mb-6 line-clamp-2 max-w-2xl'>
                  {i18n.language === "bn" ? slide.description_bn || slide.description : slide.description}
                </p>
                <Link to={`/blogs/${slide._id}`}>
                  <button className='px-6 py-3 bg-white text-black font-outfit font-bold rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-300 transform hover:-translate-y-1'>
                    {t('readMore') || 'Read More'}
                  </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>


      {/* Modern CSS for Swiper customization */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(4px);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-button-next:after,
        .hero-swiper .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          background: #2563eb;
        }
        .hero-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #2563eb;
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
};

export default Hero;
