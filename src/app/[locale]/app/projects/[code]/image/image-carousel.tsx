'use client'

import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from '@/components/extension/carousel'
import { Tables } from '@/lib/supabase/types/database.types'
import Image from 'next/image'
import ImageCarouselMaximizeButton from './image-carousel-maximize-button'

interface Props {
  projectImages: Tables<'project_image'>[]
  projectTranslation: Tables<'project_translation'>
}

export default function ImageCarousel({
  projectImages,
  projectTranslation,
}: Props) {
  const coverImage = projectImages.find(({ cover }) => cover)!
  const thumbnails = projectImages.filter(({ cover }) => !cover)

  return (
    <Carousel
      carouselOptions={{
        breakpoints: {
          '(max-width: 1024px)': { axis: 'x' },
        },
      }}
      className="flex items-center gap-0 lg:gap-2"
      orientation="vertical"
    >
      <CarouselThumbsContainer className="hidden h-80 basis-1/4 lg:flex lg:h-[464px]">
        {[coverImage, ...thumbnails].map((img, index) => (
          <SliderThumbItem
            key={index}
            index={index}
            className="basis-0 rounded-md bg-transparent"
          >
            <Image
              alt={`Thumbnail ${index + 1} for ${projectTranslation.name}`}
              className="size-full rounded-md object-cover"
              width={160}
              height={160}
              src={img.url}
              placeholder="blur"
              blurDataURL="/img/placeholder-image.svg"
            />
          </SliderThumbItem>
        ))}
      </CarouselThumbsContainer>
      <div className="group relative grow basis-3/4">
        <CarouselMainContainer className="h-80 flex-row! lg:h-[464px] lg:flex-col!">
          {[coverImage, ...thumbnails].map((img, index) => (
            <SliderMainItem
              key={index}
              className="relative flex items-center justify-center rounded-md border border-muted"
            >
              <Image
                alt={`Image ${index + 1} for ${projectTranslation.name}`}
                blurDataURL="/img/placeholder-image.svg"
                className="rounded-lg object-cover"
                fill
                placeholder="blur"
                priority={index === 0}
                sizes="50vw"
                src={img.url}
              />
            </SliderMainItem>
          ))}
        </CarouselMainContainer>
        <ImageCarouselMaximizeButton className="opacity-0 group-hover:opacity-100" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 lg:hidden">
          <CarouselThumbsContainer className="flex-row gap-x-1">
            {[coverImage, ...thumbnails].map((_, index) => (
              <CarouselIndicator
                className="text-white hover:bg-white/90 data-[active='false']:bg-white/50 data-[active='true']:bg-white"
                index={index}
                key={index}
              />
            ))}
          </CarouselThumbsContainer>
        </div>
      </div>
    </Carousel>
  )
}
