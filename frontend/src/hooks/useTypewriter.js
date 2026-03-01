 import { useState,useEffect } from "react"
 export default function useTypewriter(text, speed = 45, startDelay = 700) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let startTimeout
    startTimeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(startTimeout)
  }, [text, speed, startDelay])

  return { displayed, done }
}
