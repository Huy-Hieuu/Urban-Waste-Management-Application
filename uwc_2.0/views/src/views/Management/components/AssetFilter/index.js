import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EButton from "../../../../components/EButton"
import { useCallback, useRef, useState } from "react"
import useOnClickedOutSide from "../../../../hooks/useOnClickOutside"

 
const AssetFilter = ({
    options = [
        'Active', 
        'InActive',
        'Collector', 
        'Janitor'
    ],
    defaultSelectedId = [],
}) => {

    const [ showOptions, setShowOptions ] = useState(false)
    const [ selectedId, setSelectedId ] = useState(defaultSelectedId)
    const wrapperRef = useRef()

    const handleClickOutside = useCallback(() => {
        setShowOptions(false)
    }, [])

    const handleFilterPress = () => {
        setShowOptions(prev => !prev)
    }

    const handleOptionPress = (index) => {
        setSelectedId(prev => {
            if (prev.includes(index)) {
                return prev.filter(id => id !== index)
            }
            return [...prev, index]
        })
    }

    useOnClickedOutSide(wrapperRef, handleClickOutside)
    
    return (
        <div className={`relative flex items-center px-5 w-[300px] shadow-sm ${showOptions && "ring-2"} transition-all`}
            ref={wrapperRef}
        >
            <EButton className="flex items-center justify-between gap-2 w-full h-full"
                onClick={handleFilterPress}
            >
                <ul className="flex gap-1">
                    {selectedId.length ? 
                        selectedId.map(id => (
                            <span className="mr-2 underline underline-offset-4 decoration-blue-500 decoration-2">
                                {options[id]}
                            </span>
                        )):
                        <span className="mr-2 text-slate-400 font-medium decoration-4">
                            No Filter
                        </span>
                    }
                </ul>
                <FontAwesomeIcon icon={faChevronDown} 
                    className="text-sm text-slate-400"
                />
            </EButton>

            {showOptions &&
            <ul className="absolute top-12 left-0 z-20
                    flex flex-col w-full shadow-md bg-white
                    "
            >
                {options.map((item, index) => (
                    <EButton
                        key={index}
                        className={`w-full text-start px-4 py-2 hover:bg-slate-50 active:opacity-60 transition-opacity ${selectedId.includes(index) && "bg-slate-100"}`}
                        onClick={() => handleOptionPress(index)}
                        >
                        {item}
                    </EButton>
                ))}
            </ul>}
            
        </div>
    )
}

export default AssetFilter