import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from "../Modal"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"


const LoadingModal = () => {
    return (
        <Modal>
            <span className="text-white text-4xl animate-spin">
                <FontAwesomeIcon icon={faSpinner} />
            </span>
        </Modal>
    )
}

export default LoadingModal