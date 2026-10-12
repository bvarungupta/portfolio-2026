import Image from "next/image"
import { Rise } from "cube-motion/react"
import WorkGallery from "./workGallery"
import MouseColorBloom from "./MouseColorBloom"
import ParallaxImages from "./ParallaxImages"
import EmailSection from "./EmailSection"
import VisualIdentityGallery from "./visualIdentityGallery"
import dynamic from "next/dynamic"

const DesignProcessGallery = dynamic(() => import("./DesignProcessGallery"), {
  ssr: false,
})
const MotionDesignGallery = dynamic(() => import("./MotionDesignGallery"), {
  ssr: false,
})
import DeferredVisualExplorations from "./DeferredVisualExplorations"

export default function HomePortfolio() {
  return (
    <div className="bg-white relative">

      <Image
        data-hero-pillar="left"
        src="/images/HomeImages/piller-v.svg"
        alt=""
        width={120}
        height={800}
        className="absolute top-0 h-screen w-auto object-contain object-top pointer-events-none select-none hidden md:block"
        style={{ zIndex: 0, opacity: 0.18, left: "-70px" }}
      />
      <Image
        data-hero-pillar="right"
        src="/images/HomeImages/piller-2-v.svg"
        alt=""
        width={120}
        height={800}
        className="absolute top-0 h-screen w-auto object-contain object-top pointer-events-none select-none hidden md:block"
        style={{ zIndex: 0, opacity: 0.18, right: "-40px" }}
      />
      <MouseColorBloom />

      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center items-center text-center gap-6 overflow-hidden md:overflow-visible">
          <ParallaxImages />

          <Rise as="div" targets="children" className="relative flex flex-col items-center gap-6 md:bg-white md:px-6 md:py-4" style={{ zIndex: 5 }}>
            <Image
              id="hero-logo-outline"
              src="/images/common/vg-outline.svg"
              alt="Varun Gupta Portfolio Logo"
              width={48}
              height={48}
              className="opacity-50"
              style={{ marginBottom: "70px" }}
            />
            <h1 data-hero-element="heading" className="text-4xl md:text-5xl tracking-tight text-black">
              <span style={{ fontFamily: "VarunCapsSans, sans-serif", fontSize: "1.5em" }}>V</span><span style={{ fontFamily: "SatishSans, sans-serif", marginLeft: "4px" }}>arun </span>
              <span style={{ fontFamily: "VarunCapsSans, sans-serif", fontSize: "1.5em" }}>G</span><span style={{ fontFamily: "SatishSans, sans-serif", marginLeft: "4px" }}>upta</span>
            </h1>
            <p
              data-hero-element="tagline"
              className="text-sm md:text-base text-gray-600 leading-relaxed max-w-md"
              style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: "300" }}
            >
              I design what early-stage startups need to exist. Brand, product, and system. From first brief to live product.
            </p>
          </Rise>

          <div data-hero-element="email" className="absolute bottom-28 md:bottom-20 left-0 right-0 flex justify-center items-center" style={{ zIndex: 5 }}>
            <EmailSection />
          </div>
        </div>

        <div className="relative">
          <div data-section="work">
            <WorkGallery featuredOnly={true} showViewMore={true} />
          </div>

          <div data-section="design-process">
            <DesignProcessGallery />
          </div>

          <div data-section="visual-identity">
            <VisualIdentityGallery />
          </div>

          <div data-section="motion-design">
            <MotionDesignGallery />
          </div>

          <div data-section="visual-explorations">
            <DeferredVisualExplorations />
          </div>
        </div>

      </div>
    </div>
  )
}
