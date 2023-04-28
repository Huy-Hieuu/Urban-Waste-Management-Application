import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EButton from "../../../../components/EButton"
import SearchBar from "../SearchBar"
import { useCallback, useState } from "react"
import RouteDetail from "../RouteDetail"
import { useRouteContext } from "../../../../context/RouteContext"

const RouteList = () => {

    const [ showRouteDetail, setShowRouteDetail ] = useState({visible: false, id: null})

    const { routes } = useRouteContext()

    const handleRoutePress = useCallback((id) => {
        setShowRouteDetail({visible: true, id})
    }, [])

    const handleCloseRouteDetail = useCallback(() => {
        setShowRouteDetail({visible: false, id: null})
    }, [])

    return (
        <div className="w-full flex">
            <div className="flex flex-col gap-4 min-w-full">
                <SearchBar className="h-12 mr-4"/>
                <section className="h-[500px] pr-4 overflow-auto">
                    {!showRouteDetail.visible && 
                    routes?.map((route => (
                        <RouteItem
                            key={route.id}
                            onSelect={handleRoutePress}
                            data={route}
                        />
                    )))}
                </section>
            </div>
            <section className={`min-w-full transition-all bg-white ${showRouteDetail.visible ? "block -translate-x-full" : "translate-x-0"}`}>
                {showRouteDetail.visible &&
                <RouteDetail
                    onClose={handleCloseRouteDetail}
                    id={showRouteDetail.id}
                />}
            </section>
        </div>
    )
}

export default RouteList


const RouteItem = ({
    onSelect,
    data
}) => {

    const { id } = data
    const handleButtonPress = () => {
        onSelect(id)
    }

    return (
        <div className={` even:bg-slate-50 overflow-hidden`}>
            <EButton className="w-full flex items-center justify-between p-4"
                onClick={handleButtonPress}
            >
                <h3 className="font-medium">{id} - {data.name}</h3>
                <FontAwesomeIcon className="text-sm text-slate-400" icon={faChevronRight} />
            </EButton>
        </div>
    )
}
