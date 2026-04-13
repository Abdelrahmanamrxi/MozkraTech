import { useState } from "react"
import { useEffect } from "react"
function useDebounce(value,delay=300) {
 const [debouncedValue,setDebounced]=useState(value)
    useEffect(()=>{
      const timer= setTimeout(()=>{
        setDebounced(value)
        },delay)
    return ()=>clearTimeout(timer,delay)
    },[value,delay])
    
    return debouncedValue
}

export default useDebounce
