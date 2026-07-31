"use client"

import React from "react"
import { cn } from "../../../../lib/util/cn"
import { integralCF } from "../../../../styles/fonts"

type LegacyReview = {
  id: number
  user: string
  content: string
  rating: number
  date: string
}

const reviewsData: LegacyReview[] = [
  {
    id: 1,
    user: "Priya Sharma",
    content:
      '"Thread Buy has revolutionized my boutique business! The quality of ethnic wear from brands like LILY & LALI and SAYURI is exceptional. My customers love the intricate handwork and premium fabrics. The direct manufacturer connection ensures authentic products at competitive prices."',
    rating: 5,
    date: "December 15, 2024",
  },
  {
    id: 2,
    user: "Rajesh Kumar",
    content: `"As a retailer in Delhi, I've been sourcing from Thread Buy for 6 months now. The variety of brands like KASVI, ICON, and ODDY gives me a competitive edge. The quality is consistent, and the delivery is always on time. My sales have increased by 40% since partnering with them."`,
    rating: 5,
    date: "December 10, 2024",
  },
  {
    id: 3,
    user: "Anita Mehta",
    content: `"The festival collection from LILY & LALI is absolutely stunning! The handwork on the sarees and lehengas is exquisite. My customers are always asking for more pieces from this brand. Thread Buy makes it so easy to access premium fashion directly from manufacturers."`,
    rating: 5,
    date: "December 8, 2024",
  },
  {
    id: 4,
    user: "Vikram Singh",
    content: `"I run a multi-brand store in Mumbai, and Thread Buy has been a game-changer. The range of western wear from brands like BLACK HAWK and FASHIONARE'S is perfect for my young customers. The quality is top-notch, and the pricing is very competitive."`,
    rating: 5,
    date: "December 5, 2024",
  },
  {
    id: 5,
    user: "Sunita Reddy",
    content: `"The kids' collection from brands like PUBJ BOYS and LITTLE DEMON is adorable! The fabrics are soft and comfortable for children. My customers appreciate the quality and the trendy designs. Thread Buy has made sourcing children's wear so much easier."`,
    rating: 5,
    date: "December 3, 2024",
  },
  {
    id: 6,
    user: "Amit Patel",
    content: `"Being a fashion retailer in Gujarat, I need reliable suppliers. Thread Buy delivers consistently high-quality products from authentic brands. The customer service is excellent, and they understand the Indian market well. Highly recommended for any fashion business!"`,
    rating: 5,
    date: "November 28, 2024",
  },
]

const ReviewCard = ({
  data,
  className,
}: {
  data: LegacyReview
  className?: string
}) => {
  return (
    <div
      className={cn(
        "border border-black/10 rounded-[15px] sm:rounded-[20px] p-4 sm:p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300",
        className
      )}
    >
      <div className="flex mb-3">
        {Array.from({ length: data.rating }).map((_, index) => (
          <span key={index} className="text-[#FFC633] text-base sm:text-lg">
            ⭐
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <strong className="text-sm sm:text-base text-gray-900">
            {data.user}
          </strong>
          <span className="text-[#01AB31] text-base sm:text-lg">✅</span>
        </div>
        <span className="text-xs text-gray-500">{data.date}</span>
      </div>
      <p className="text-black/70 text-xs sm:text-sm leading-[18px] sm:leading-[22px] line-clamp-4 sm:line-clamp-5">
        {data.content}
      </p>
    </div>
  )
}

const Reviews = () => {
  return (
    <section className="overflow-hidden bg-gray-50 py-12 md:py-16">
      <div className="animate-fade-in-up">
        <div className="relative w-full">
          <div className="relative flex items-end sm:items-center max-w-frame mx-auto mb-8 md:mb-12 px-4 xl:px-0">
            <h2
              className={cn([
                integralCF.className,
                "text-2xl sm:text-[32px] leading-[28px] sm:leading-[36px] md:text-5xl capitalize mr-auto animate-fade-in-up delay-300",
              ])}
            >
              OUR HAPPY CUSTOMERS
            </h2>
          </div>

          {/* Horizontal Scrollable Reviews */}
          <div className="relative">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 px-4 xl:px-0">
              {reviewsData.map((review, index) => (
                <div
                  key={review.id}
                  className="flex-none w-[280px] sm:w-[320px] md:w-[350px] animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <ReviewCard data={review} className="h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Reviews
