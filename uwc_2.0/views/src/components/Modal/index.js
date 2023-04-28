import { useEffect } from "react"
import ReactDOM from "react-dom"

const Modal = ({children, ...props}) => {

    const handleDisableScroll = () => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'overlay'
        }
    }

    useEffect(handleDisableScroll, [])

    return (
        ReactDOM.createPortal(<>
        <div className="fixed top-0 z-50 w-full h-[100vh] flex items-center justify-center bg-slate-800 bg-opacity-60">
            {children}
        </div>
        </>, document.querySelector('body'))
    )
}

export default Modal