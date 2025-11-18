import React, { useEffect, useRef } from 'react'

const Hero = ({ title, subtitle, backgroundImage, ctaText, ctaLink, videoPath = '/anavideo.mp4' }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let playAttemptInterval

    const playVideo = () => {
      if (video.paused && !video.ended) {
        video.play().catch(err => {
          console.log('Video play attempt failed:', err)
        })
      }
    }

    const handleCanPlay = () => {
      playVideo()
    }

    const handleEnded = () => {
      // Video bittiğinde başa sar ve tekrar oynat
      video.currentTime = 0
      playVideo()
    }

    const handlePause = () => {
      if (!video.ended) {
        setTimeout(playVideo, 100)
      }
    }

    const handleLoadedMetadata = () => {
      playVideo()
    }

    // Video path değiştiğinde video'yu yeniden yükle
    video.load()

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('canplaythrough', handleCanPlay)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('pause', handlePause)
    
    playAttemptInterval = setInterval(() => {
      if (video.paused && !video.ended && video.readyState >= 3) {
        playVideo()
      }
    }, 1000)

    setTimeout(playVideo, 200)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('canplaythrough', handleCanPlay)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('pause', handlePause)
      if (playAttemptInterval) {
        clearInterval(playAttemptInterval)
      }
    }
  }, [videoPath]) // videoPath değiştiğinde useEffect tekrar çalışsın

  return (
    <div 
      className="hero-container relative overflow-hidden"
      style={{ 
        height: '100vh', 
        minHeight: '100vh', 
        width: '100%',
        backgroundColor: '#f0f4f8',
        backgroundImage: 'linear-gradient(to bottom right, #eff6ff, #f1f5f9)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className="hero-video absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        style={{ 
          objectFit: 'cover', 
          width: '100%', 
          height: '100%',
          zIndex: 0
        }}
      >
        <source src={videoPath} type="video/mp4" />
      </video>
    </div>
  )
}

export default Hero

