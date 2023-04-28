import ReactDOM from "react-dom"
import { useRef } from "react"
import EButton from "../EButton"
import useOnClickedOutSide from "../../hooks/useOnClickOutside"
import { useEmployeeContext } from "../../context/EmployeeContext"

const EmployeeSearchTab = ({
    clickPosition,
    onClose,
    filter,
    onSelect = () => {}
}) => {

    const { employees } = useEmployeeContext()
    const isEnoughBottomSpace = clickPosition.y < (window.innerHeight - 400)
    console.log('enough ? __-',isEnoughBottomSpace)
    const wrapperRef = useRef()

    const handleEmployeeSelect = (id, fullname) => {
        onSelect(id, fullname)
        onClose()
    }

    useOnClickedOutSide(wrapperRef, onClose)

    return (
        ReactDOM.createPortal(
            <div className={`fixed z-50 bg-white shadow-md w-[340px] min-h-[300px] max-h-[500px]
                ${isEnoughBottomSpace ? "-translate-y-1/3" : "-translate-y-full"}
            `}
                style={{left: clickPosition.x, top: clickPosition.y}}
                ref={wrapperRef}
            >
                <input
                    className="p-2 bg-slate-50 w-full outline-none transition-all ring-2 focus:ring-3"
                    placeholder="Search Employee ..."
                />
                <ul className="flex flex-col text-slate-600">
                    {employees.filter(filter)
                    .map(em => (
                        <EmployeeSearchTabItem
                            key={em.id}
                            onSelect={handleEmployeeSelect}
                            data={em}
                        />
                    ))}
                </ul>
            </div>
        , document.querySelector('body'))

    )
}

const EmployeeSearchTabItem = ({
    data,
    onSelect
}) => {
    const handlePress = () => {
        onSelect(data.id, data.fullname)
    }

    return (
        <EButton 
            className="p-2 text-start border-t border-slate-300 last:border-b active:opacity-50 transition-opacity"
            onClick={handlePress}
        >
            {data.id} - {data.fullname} - {data.role}
        </EButton>
    )
}

export default EmployeeSearchTab