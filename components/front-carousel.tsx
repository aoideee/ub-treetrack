"use client";

import "@/styles/main.css";

import { useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function FrontCarousel() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <section className="front-carousel">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-xs"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lacinia,
        nibh molestie tincidunt posuere, nisl massa efficitur urna, non iaculis
        ligula urna in metus. Nullam posuere accumsan eros vel condimentum.
        Quisque est eros, scelerisque hendrerit justo eu, maximus auctor lectus.
        Praesent elementum placerat orci ut volutpat. Cras et augue massa. Morbi
        at justo auctor, imperdiet elit sit amet, hendrerit leo. Suspendisse
        convallis varius arcu ut congue. Donec sodales leo tempor lorem cursus
        porttitor tincidunt at est. Suspendisse eu libero ac velit tristique
        venenatis id id mauris. Duis risus arcu, hendrerit sit amet ante vitae,
        sagittis pharetra ex. In id lorem orci. Nunc placerat, tortor eu varius
        mattis, metus nunc porta nibh, quis pharetra sapien sem quis leo. Donec
        vel gravida massa. Morbi scelerisque accumsan condimentum. Duis in
        eleifend massa. Vestibulum sit amet ante tempor, vulputate orci rutrum,
        pulvinar lectus. Mauris vel felis ac tellus pellentesque aliquam a ac
        ligula. Aliquam placerat velit tellus. Donec ac lorem et neque egestas
        pharetra. Pellentesque metus arcu, aliquam sit amet hendrerit ut,
        volutpat ac orci. Aliquam pharetra lacus et blandit bibendum.
      </p>
    </section>
  );
}
