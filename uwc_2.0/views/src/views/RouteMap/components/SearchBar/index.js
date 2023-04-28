import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

const SearchBar = ({className, ...props}) => {
    const [ value, setValue ] = useState('')
    const [ isFocus, setIsFocus ] = useState(false)

    const handleInputChange = (e) => {
        setValue(e.target.value)
    }

    const handleInputFocus = () => {
        setIsFocus(true)
    }

    const handleInputBlur = () => {
        setIsFocus(false)
    }

    return (
        <div className={`relative bg-slate-100 flex items-center shadow-sm text-slate-900 transition-all ${isFocus ? "ring-2": "opacity-60"} ${className}`}
        >
            <FontAwesomeIcon icon={faSearch}
                className="w-10 absolute"
            />
            <input className="bg-transparent outline-none w-full pl-10"
                value={value}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                {...props}
            />
        </div>
    )
}

export default SearchBar