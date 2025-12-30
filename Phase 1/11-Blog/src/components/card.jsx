import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'

const Card = () => {
  const scrollRef = useRef(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const isDragging = useRef(false)

  useEffect(() => {
    const lenis = new Lenis()
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const slider = scrollRef.current

    const handleMouseDown = (e) => {
      isDown.current = true
      startX.current = e.pageX - slider.offsetLeft
      scrollLeft.current = slider.scrollLeft
      isDragging.current = false
    }

    const handleMouseLeave = () => {
      isDown.current = false
    }

    const handleMouseUp = (e) => {
      if (!isDragging.current) {
        // 👉 Ye normal click hoga
        console.log("Card clicked!", e.target)
        // yahan tum blog open karne ka logic add kar sakte ho
      }
      isDown.current = false
    }

    const handleMouseMove = (e) => {
      if (!isDown.current) return
      e.preventDefault()
      isDragging.current = true
      const x = e.pageX - slider.offsetLeft
      const walk = (x - startX.current) * 2
      slider.scrollLeft = scrollLeft.current - walk
    }

    slider.addEventListener('mousedown', handleMouseDown)
    slider.addEventListener('mouseleave', handleMouseLeave)
    slider.addEventListener('mouseup', handleMouseUp)
    slider.addEventListener('mousemove', handleMouseMove)

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown)
      slider.removeEventListener('mouseleave', handleMouseLeave)
      slider.removeEventListener('mouseup', handleMouseUp)
      slider.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      className="h-screen w-screen flex flex-row gap-2 overflow-x-auto scroll-container"
    >
      {Array.from({ length:3 }).map((_, i) => (
        <div
          key={i}
          className=" flex flex-col justify-start p-4 m-4 items-center h-3/5 w-1/4 bg-gray-300 rounded-3xl  shrink-0"
        >
          <div className='bg-black h-1/3 w-[85%]  rounded-2xl  overflow-hidden '>
          <img src="https://plus.unsplash.com/premium_photo-1668485966810-cbd0f685f58f?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" 
          className="h-full w-full object-cover"
            />
          </div>
          <div className='items-center flex flex-col mt-8 w-[85%] mb-12'>
            <h1 className='text-2xl font-bold '>sophia</h1>
            <p className='text-sm break-all'>Discover amazing travel stories and insights from around the world. Join us as we explore hidden gems and share unforgettable moments.</p>
          </div>
          <button className='bg-[#9b7b63] h-8 w-24 rounded-2xl hover:bg-[#815c3f]'>Read More</button>
        </div>
      ))}
    </div>
  )
}

export default Card