import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EButton from "../EButton"
import { faClose } from "@fortawesome/free-solid-svg-icons"


const ModalCloseButton = ({onClick, ...props}) => {

    const handleButtonPress = () => {
        if (onClick) {
            onClick()
        }
    }

    return (
        <EButton className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 rounded-full w-6 h-6 bg-white shadow-sm" 
            onClick={handleButtonPress}
        >
            <FontAwesomeIcon icon={faClose}/>
        </EButton>
    )
}

export default ModalCloseButton