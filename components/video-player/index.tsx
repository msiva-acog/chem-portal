"use client"

import ReactPlayer from "react-player"
import type { VideoPlayerProps } from "./type"

export function VideoPlayer({ 
  url, 
  title,
  autoPlay = true,
  showControls = true,
  className
}: VideoPlayerProps) {
  return (
    <div className={`relative pb-3.5 aspect-video ${className}`}>
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        playing={autoPlay}
        controls={showControls}
        title={title}
        pip={true}
        stopOnUnmount={true}
      />
    </div>
  )
}