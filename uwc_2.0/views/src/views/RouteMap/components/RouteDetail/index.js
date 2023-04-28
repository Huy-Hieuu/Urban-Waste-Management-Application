import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EButton from "../../../../components/EButton"
import { faChevronLeft, faClose, faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useCallback, useEffect, useMemo, useState } from "react"
import EmployeeSearchTab from "../../../../components/EmployeeSearchTab"
import { useEmployeeContext } from "../../../../context/EmployeeContext"
import { useMcpContext } from "../../../../context/McpContext/McpProvider"
import { useRouteContext } from "../../../../context/RouteContext"
import { useMapContext } from "../../context/MapContext"
import { DEPOT_POINT, TREATMENT_POINT } from "../../../../models/mcps"
import L from "leaflet"

const RouteDetail = ({
    id,
    onClose
}) => {

    const [ clickPosition, setClickPosition ] = useState({x:0, y:0})
    const { mcps } = useMcpContext()
    const { routes } = useRouteContext()
    const { employees } = useEmployeeContext()
    const { routeControl } = useMapContext()

    const routeData = useMemo(() => routes.find(r => r.id === id), [routes, id])
    const routeMcps = useMemo(() => routeData.contains.map(mid => mcps.find(m => m.id === mid)), [mcps, routeData])
    const routeEmployee = employees.find(em => em.route === id)

    const [ showEmployeeSelector, setShowEmployeeSelector ] = useState(false)
    const { dispatcher: employeeDispatcher } = useEmployeeContext()

    const handleShowRoute = () => {
        const controlRef = routeControl.current
        setTimeout(() => {
            const wayPoints = routeMcps.map(mcp => L.latLng(mcp.location.x, mcp.location.y))
            controlRef.setWaypoints([
                DEPOT_POINT,
                ...wayPoints,
                TREATMENT_POINT
            ])
        },0);

        return () => {
            controlRef.setWaypoints([])
        }
    }

    const handleAssignEmployeePress = useCallback((e) => {
        setClickPosition({
            x: e.pageX,
            y: e.pageY
        })
        setShowEmployeeSelector(true)
    }, [])

    const handleCloseEmployeeSelector = useCallback(() => {
        setShowEmployeeSelector(false)
    }, [])

    const handleFilterEmployee = useCallback((employee) => {
        return employee.route === null && employee.role === "Collector"
    }, [])

    const handleEmployeeSelect = useCallback((employeeId, fullname) => {
        employeeDispatcher({type: 'patch', data: {
            id: employeeId,
            data: {
                route: id
            }
        }})
    }, [employeeDispatcher, id])

    const handleUnAssignEmployee = useCallback(() => {
        const employeeId = routeEmployee.id
        employeeDispatcher({type: 'patch', data: {
            id: employeeId,
            data: {route: null}
        }})
    }, [employeeDispatcher, routeEmployee])

    useEffect(handleShowRoute, [routeControl, routeMcps])

    return (
        <>
            {showEmployeeSelector &&
            <EmployeeSearchTab
                clickPosition={clickPosition}
                onClose={handleCloseEmployeeSelector}
                onSelect={handleEmployeeSelect}
                filter={handleFilterEmployee}
            />}
            <section className="flex justify-between items-baseline py-2">
                <h3 className="text-xl font-medium">Route 3</h3>
                <EButton className="pl-4 hover:pr-2 transition-all text-blue-400"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </EButton>
            </section>

            <section className="mt-2">
                <h3 className="bg-slate-100 p-2 font-medium text-slate-700">Employee</h3>
                {routeEmployee ? 
                <div className="bg-slate-50 p-2 py-4 flex justify-between">
                    <span>{routeEmployee.fullname}</span>
                    <EButton className="text-red-400 hover:pr-2 active:opacity-60 transition-all"
                        onClick={handleUnAssignEmployee}
                    >
                        <FontAwesomeIcon icon={faClose}/>
                    </EButton>
                </div> :
                <div className="bg-slate-50 p-2 py-4 flex justify-between">
                    <span className="text-slate-300">______________</span>
                    <EButton className="text-teal-500 hover:pr-2 active:opacity-60 transition-all"
                        onClick={handleAssignEmployeePress}
                    >
                        <FontAwesomeIcon icon={faPenToSquare}/>
                    </EButton>
                </div>}
            </section>

            <section className="mt-2">
                <h3 className="p-2 bg-slate-100 text-slate-700 font-medium">MCPs</h3>
                <table className="flex flex-col bg-slate-50">
                    <section className="grid grid-cols-[100px_2fr_3fr] font-medium p-2">
                        <span>ID</span>
                        <span>Name</span>
                        <span>Location</span>
                    </section>
                    {routeMcps.map(mcp => (
                        <MCPRow
                            key={mcp.id}
                            data={mcp}
                        />
                    ))}
                </table>
            </section>
        </>
    )
}

const MCPRow = ({data}) => {

    return (
        <div className="grid grid-cols-[100px_2fr_3fr] even:bg-white p-2">
            <span>{data.id}</span>
            <span>{data.name}</span>
            <span>{data.location_name}</span>
        </div>
    )
}

export default RouteDetail