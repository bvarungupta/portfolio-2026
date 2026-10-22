"use client"

import dynamic from "next/dynamic"

const VisualExplorationsGallery = dynamic(() => import("./visualExplorationsGallery"), {
  ssr: false,
})

export default function DeferredVisualExplorations() {
  return <VisualExplorationsGallery />
}
