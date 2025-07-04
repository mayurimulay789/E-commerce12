import { Link } from "react-router-dom"

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden text-white bg-gradient-to-r from-gray-900 to-gray-700">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container relative px-4 py-20 mx-auto lg:py-32">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <h1 className="text-4xl font-bold leading-tight lg:text-6xl">
              Oversized
              <span className="block text-blue-400">Comfort</span>
              Redefined
            </h1>
            <p className="text-xl leading-relaxed text-gray-300">
              Discover our premium collection of oversized unisex t-shirts. Where comfort meets style in perfect
              harmony.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/products"
                className="px-8 py-4 font-semibold text-center text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 font-semibold text-center text-white transition-colors border-2 border-white rounded-lg hover:bg-white hover:text-gray-900"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="/placeholder.svg?height=600&width=500"
              alt="Hero Product"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <div className="absolute px-4 py-2 font-bold text-white bg-red-500 rounded-full -top-4 -right-4">
              New Collection
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute w-20 h-20 bg-blue-500 rounded-full top-10 left-10 opacity-20 animate-pulse"></div>
      <div className="absolute w-32 h-32 bg-purple-500 rounded-full bottom-10 right-10 opacity-20 animate-bounce"></div>
    </section>
  )
}

export default HeroSection
