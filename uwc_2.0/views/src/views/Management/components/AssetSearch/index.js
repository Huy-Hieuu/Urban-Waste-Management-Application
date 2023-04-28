import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EButton from "../../../../components/EButton"
import { useRef, useState } from "react"



const AssetSearch = () => {
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
        <div className={`relative bg-slate-100 flex items-center shadow-sm text-slate-900 transition-all ${isFocus ? "ring-2": "opacity-40"}`}
        >
            <FontAwesomeIcon icon={faSearch}
                className="w-10 absolute"
            />
            <input className="bg-transparent outline-none w-[300px] pl-10"
                value={value}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
            />
        </div>
    )
}

export default AssetSearch