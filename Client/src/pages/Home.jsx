import HeroSection from "../components/Home/HeroSection"
import FeaturedProducts from "../components/Home/FeaturedProducts"
import TrendingProducts from "../components/Home/TrendingProducts"

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <TrendingProducts />

      {/* About Brand Section */}
      <section className="py-16 text-white bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold lg:text-4xl">Why Choose Ksauni Bliss?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 bg-blue-600 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">Premium Quality</h3>
                    <p className="text-gray-300">Made from 100% premium cotton for ultimate comfort and durability.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 bg-blue-600 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">Unisex Design</h3>
                    <p className="text-gray-300">Thoughtfully designed to fit and flatter all body types perfectly.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 bg-blue-600 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">Fast Delivery</h3>
                    <p className="text-gray-300">Quick and reliable shipping across India with tracking support.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="About Us"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">What Our Customers Say</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Priya Sharma",
                rating: 5,
                comment: "Amazing quality and super comfortable! The oversized fit is perfect.",
                image: "/placeholder.svg?height=60&width=60",
              },
              {
                name: "Rahul Kumar",
                rating: 5,
                comment: "Love the designs and the fabric quality. Will definitely order more!",
                image: "/placeholder.svg?height=60&width=60",
              },
              {
                name: "Sneha Patel",
                rating: 5,
                comment: "Fast delivery and excellent customer service. Highly recommended!",
                image: "/placeholder.svg?height=60&width=60",
              },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 mr-4 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="italic text-gray-600">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
