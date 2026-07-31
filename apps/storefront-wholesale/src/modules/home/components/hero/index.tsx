import Image from "next/image"
import Link from "next/link"
import React from "react"
import { integralCF } from "../../../../styles/fonts"
import { cn } from "../../../../lib/util/cn"

const Hero = () => {
  return (
    <header className="bg-[#F2F0F1] pt-10 md:pt-24 overflow-hidden">
      <div className="md:max-w-frame mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <section className="max-w-frame px-4">
          <h2
            className={cn([
              integralCF.className,
              "text-2xl sm:text-3xl md:text-4xl lg:text-[64px] lg:leading-[64px] mb-4 sm:mb-5 lg:mb-8 leading-tight animate-fade-in-up",
            ])}
          >
            FIND CLOTHES THAT{" "}
            <span className="relative inline-block">
              <span className="relative z-10">MATCHES</span>
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-orange-400 to-red-400 opacity-30 rounded-sm"></div>
            </span>{" "}
            YOUR STYLE
          </h2>
          <p className="text-black/60 text-sm sm:text-base lg:text-base mb-6 lg:mb-8 max-w-[545px] leading-relaxed">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <div className="relative flex flex-col sm:flex-row gap-4 mb-5 md:mb-12">
            {/* Primary CTA Button */}
            <Link
              href="/store"
              className="group relative w-full sm:w-auto md:w-64 inline-block text-center bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black transition-all duration-300 text-white px-8 sm:px-16 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Shop Now
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              {/* Animated background effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>

            {/* Secondary CTA Button */}
            <Link
              href="/brands"
              className="group relative w-full sm:w-auto md:w-48 inline-block text-center bg-white border-2 border-black hover:bg-black transition-all duration-300 text-black hover:text-white px-6 sm:px-12 py-4 sm:py-5 rounded-full text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Brands
                <svg
                  className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </span>
            </Link>

            {/* Floating elements for extra attention */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
          </div>
          <div className="flex md:h-full md:max-h-11 lg:max-h-[52px] xl:max-h-[68px] items-center justify-center md:justify-start flex-wrap sm:flex-nowrap md:space-x-3 lg:space-x-6 xl:space-x-8 md:mb-[116px] gap-4 sm:gap-6">
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-bold text-xl sm:text-2xl md:text-xl lg:text-3xl xl:text-[40px] xl:mb-2">
                200+
              </span>
              <span className="text-xs sm:text-sm xl:text-base text-black/60 text-nowrap">
                International Brands
              </span>
            </div>
            <div className="hidden sm:block w-px h-12 md:h-full bg-black/10" />
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-bold text-xl sm:text-2xl md:text-xl lg:text-3xl xl:text-[40px] xl:mb-2">
                2000+
              </span>
              <span className="text-xs sm:text-sm xl:text-base text-black/60 text-nowrap">
                High-Quality Products
              </span>
            </div>
            <div className="hidden sm:block w-px h-12 md:h-full bg-black/10" />
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-bold text-xl sm:text-2xl md:text-xl lg:text-3xl xl:text-[40px] xl:mb-2">
                3000+
              </span>
              <span className="text-xs sm:text-sm xl:text-base text-black/60 text-nowrap">
                Happy Customers
              </span>
            </div>
          </div>
        </section>
        <section className="relative md:px-4 min-h-[448px] md:min-h-[428px]">
          {/* Hero Image Optimized with Next.js Image */}
          <div className="relative w-full h-full">
            <Image
              priority
              src="/images/header-homepage.png"
              alt="Fashion models showcasing Thread Buy's clothing collection"
              fill
              className="object-cover object-top xl:object-[center_top_-1.6rem]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Decorative stars with reduced animation */}
          <Image
            priority={false}
            src="/icons/big-star.svg"
            height={104}
            width={104}
            alt=""
            className="absolute right-7 xl:right-0 top-12 max-w-[76px] max-h-[76px] lg:max-w-24 lg:max-h-max-w-24 xl:max-w-[104px] xl:max-h-[104px] animate-[spin_8s_linear_infinite]"
          />
          <Image
            priority={false}
            src="/icons/small-star.svg"
            height={56}
            width={56}
            alt=""
            className="absolute left-7 md:left-0 top-36 sm:top-64 md:top-44 lg:top-56 max-w-11 max-h-11 md:max-w-14 md:max-h-14 animate-[spin_6s_linear_infinite]"
          />
        </section>
      </div>
    </header>
  )
}

export default Hero
