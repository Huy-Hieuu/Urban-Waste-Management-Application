import { useEffect, useState } from "react";

const useSmallScreen = () => {
    const [ isSmallScreen, setIsSmallScreen ] = useState(false);
    const handleSizeChange = (e) => {
        setIsSmallScreen(window.innerWidth <= 1000)
    }
    const handleTrackScreen = () => {
        window.addEventListener('resize', handleSizeChange)
        return () => window.removeEventListener('resize', handleSizeChange)
    }

    useEffect(handleTrackScreen, [])
    return isSmallScreen
}

export default useSmallScreen;
