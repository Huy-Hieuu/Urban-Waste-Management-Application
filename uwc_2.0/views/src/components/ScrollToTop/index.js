import { useEffect } from "react";

const ScrollToTop = ({children, ...props}) => {
    useEffect(() => {
        window.scrollTo(0, 0)
    })

    return (
        <>{children}</>
    )
}

export default ScrollToTop  