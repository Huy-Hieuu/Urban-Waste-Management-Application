import { useEffect, useRef } from "react"

const useIsMounted = () => {
    const mounted = useRef(false)

    const isMounted = () => mounted.current

    useEffect(() => {
        mounted.current = true
        return () => mounted.current = false
    })

    return isMounted
}

export default useIsMounted