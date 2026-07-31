import { cn } from "../../../../lib/util/cn"
import { integralCF } from "../../../../styles/fonts"
import React from "react"
import DressStyleCard from "./DressStyleCard"
import { listCollections } from "@lib/data/collections"

const DressStyle = async () => {
  // Fetch collections from the backend
  const { collections } = await listCollections({
    fields: "*products",
  })

  // Filter and limit collections for display
  const displayCollections = collections?.slice(0, 4) || []

  // Define background images for collections (can be customized per collection)
  const backgroundImages = [
    "bg-[url('/images/dress-style-1.png')]",
    "bg-[url('/images/dress-style-2.png')]",
    "bg-[url('/images/dress-style-3.png')]",
    "bg-[url('/images/dress-style-4.png')]",
  ]

  // Define layout classes for responsive design
  const layoutClasses = [
    "md:max-w-[260px] lg:max-w-[360px] xl:max-w-[407px] h-[190px]",
    "md:max-w-[684px] h-[190px]",
    "md:max-w-[684px] h-[190px]",
    "md:max-w-[260px] lg:max-w-[360px] xl:max-w-[407px] h-[190px]",
  ]

  return (
    <div className="px-4 xl:px-0">
      <section className="max-w-frame mx-auto bg-[#F0F0F0] px-4 sm:px-6 pb-6 pt-8 sm:pt-10 md:p-[70px] rounded-[20px] sm:rounded-[40px] text-center">
        <h2
          className={cn([
            integralCF.className,
            "text-2xl sm:text-[32px] leading-[28px] sm:leading-[36px] md:text-5xl mb-6 sm:mb-8 md:mb-14 capitalize animate-fade-in-up",
          ])}
        >
          BROWSE BY COLLECTION
        </h2>
        {displayCollections.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row md:h-[289px] space-y-4 sm:space-y-0 sm:space-x-5 mb-4 sm:mb-5 animate-fade-in-up delay-300">
              {displayCollections.slice(0, 2).map((collection, index) => (
                <DressStyleCard
                  key={collection.id}
                  title={collection.title}
                  url={`/collections/${collection.handle}`}
                  className={`${layoutClasses[index]} ${backgroundImages[index]}`}
                />
              ))}
            </div>
            {displayCollections.length > 2 && (
              <div className="flex flex-col sm:flex-row md:h-[289px] space-y-5 sm:space-y-0 sm:space-x-5 animate-fade-in-up delay-500">
                {displayCollections.slice(2, 4).map((collection, index) => (
                  <DressStyleCard
                    key={collection.id}
                    title={collection.title}
                    url={`/collections/${collection.handle}`}
                    className={`${layoutClasses[index + 2]} ${
                      backgroundImages[index + 2]
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default DressStyle
