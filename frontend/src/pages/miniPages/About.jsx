import React from 'react'

const about = () => {
  return (
   <section className="container mx-auto px-6 py-16 max-w-5xl text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
        About Combat Corner Bangladesh
      </h1>

      <p className="mb-6 text-lg leading-relaxed text-justify">
        Combat Corner Bangladesh is the premier online platform dedicated to promoting and growing
        Mixed Martial Arts (MMA) and boxing across Bangladesh. We strive to bring fans closer to the
        action by delivering up-to-date news, fighter profiles, event coverage, and exclusive
        behind-the-scenes content.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-justify">
        Our mission is to help combat sports achieve wider recognition in Bangladesh by connecting
        athletes, promoters, and enthusiasts. Whether you’re a seasoned fighter or a casual fan,
        Combat Corner provides you with everything you need to stay informed and engaged with the
        fast-evolving world of MMA and boxing.
      </p>

      <div className="my-10">
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <p className="text-lg leading-relaxed">
          We are a passionate group of sports journalists, MMA referees, and boxing experts
          committed to bringing the best combat sports content to you. Our team attends local and
          international events, providing firsthand insights and exclusive interviews.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
        <p className="text-lg leading-relaxed">
          Interested in joining the Combat Corner community? Whether you want to contribute articles,
          share event info, or become a part of our growing network, feel free to contact us.
          Together, we can raise the profile of MMA and boxing in Bangladesh.
        </p>
      </div>
    </section>
  )
}

export default about
