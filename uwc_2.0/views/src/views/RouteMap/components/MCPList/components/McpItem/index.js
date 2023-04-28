import { memo } from "react"
import EButton from "../../../../../../components/EButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"

const McpItem = ({
    data,
    onSelect,
}) => {

    const { id, name, location_name } = data

    const handleButtonPress = () => {
        onSelect(id)
    }

    return (
        <div className="even:bg-slate-50">
            <EButton className="w-full grid grid-cols-[50px_1fr_1fr_50px] p-4"
                onClick={handleButtonPress}
            >
                <span className="text-start">{id}</span>
                <span className="text-start">{name}</span>
                <span className="text-start font-medium">{location_name}</span>
                <span className="text-sm text-slate-400 text-right">
                    <FontAwesomeIcon icon={faChevronRight}/>
                </span>
            </EButton>
        </div>
    )
}

export default memo(McpItem)