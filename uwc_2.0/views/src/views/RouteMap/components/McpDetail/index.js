import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EButton from "../../../../components/EButton"
import { faChevronLeft, faClose, faLocation, faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useMcpContext } from "../../../../context/McpContext/McpProvider"
import { useEmployeeContext } from "../../../../context/EmployeeContext/employeeProvider"
import { memo, useCallback, useState } from "react"
import EmployeeSearchTab from "../../../../components/EmployeeSearchTab"
import { useMapContext } from "../../context/MapContext"
import { useEffect } from "react"
import Marker from "../../mapAssets/Marker"
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "../.."
import * as L from 'leaflet'
import Circle from "../../mapAssets/Circle"

const MCPDetail = ({
    id,
    onClose,
}) => {

    const { mcps, dispatcher: McpDispatcher } = useMcpContext()
    const { employees, dispatcher: employeeDispatcher } = useEmployeeContext()
    const [ clickPosition, setClickPosition ] = useState({x:0, y:0})
    const [ showEmployeeSelector, setShowEmployeeSelector ] = useState(false)
    const { setMapCenter, circleDispatcher, markerDispatcher, setMapZoom } = useMapContext()

    let mcpEmployees= null
    const MCP = mcps.find(m => m.id === id)
    const employeeIds = MCP.employees

    if (employeeIds) {
        mcpEmployees = employees.filter(em => employeeIds.includes(em.id))
    }

    const handleShowMcpMap = () => {

        setMapCenter([
            MCP.location.x,
            MCP.location.y
        ])
        setMapZoom(prev => prev + 1)

        const markerId = Marker.getNextId()
        markerDispatcher({type: 'add', data: {
            data: Marker.create({
                position: [MCP.location.x, MCP.location.y], 
                popup: () => (
                    <>{MCP.name} <hr/> {MCP.location_name}</>
                )
            })
        }})
        const circleId = Circle.getNextId()
        circleDispatcher({type: 'add', data: {
            data: Circle.create({ 
            center: [MCP.location.x, MCP.location.y], 
            radius: MCP.work_radius
        })}})

        return () => {
            markerDispatcher({type: 'delete', data: {
                id: markerId
            }})
            circleDispatcher({type: 'delete', data: {
                id: circleId
            }})
            setMapCenter(DEFAULT_MAP_CENTER)
            setMapZoom(DEFAULT_MAP_ZOOM)
        }
    }

    const handleAssignEmployeePress = useCallback((e) => {
        setClickPosition({x: e.screenX, y: e.screenY})
        setShowEmployeeSelector(true)
    }, [])

    const handleCloseEmployeeSelector = useCallback(() => {
        setShowEmployeeSelector(false)
    }, [])

    const handleFilterUnAssignedJanitor = useCallback((em) => (
        em.mcp === null && em.role === 'Janitor'
    ), [])

    const handleAssignEmployee = useCallback((employeeId) => {
        McpDispatcher({type: 'patch', data: {
            id: id,
            data: {employees: [...MCP.employees, employeeId]}
        }})
        employeeDispatcher({type: 'patch', data: {
            id: employeeId,
            data: {mcp: id}
        }})
    }, [McpDispatcher, employeeDispatcher, id, MCP])

    const handleUnAssignEmployee = useCallback((employeeId) => {

        const remainEmployees = MCP.employees.filter(em => em !== employeeId)

        McpDispatcher({type: 'patch', data: {
            id: id,
            data: {employees: remainEmployees}
        }})
        employeeDispatcher({type: 'patch', data: {
            id: employeeId,
            data: {mcp: null}
        }})
    }, [employeeDispatcher, McpDispatcher, id, MCP])


    useEffect(handleShowMcpMap, [MCP, setMapCenter, circleDispatcher, markerDispatcher, setMapZoom])

    return (
        <>
            {showEmployeeSelector && 
            <EmployeeSearchTab
                clickPosition={clickPosition}
                onClose={handleCloseEmployeeSelector}
                onSelect={handleAssignEmployee}
                filter={handleFilterUnAssignedJanitor}
            />}
            <section className="flex justify-between items-baseline py-2">
                <h3 className="text-xl font-medium">MCP 1</h3>
                <EButton className="pl-4 hover:pr-2 transition-all text-blue-400"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faChevronLeft}  />
                </EButton>
            </section>

            <section className="mt-4">
                <h3 className="bg-slate-100 p-2 font-medium text-slate-700">Location</h3>
                <div className="flex justify-between p-2 bg-slate-50">
                    <span>{MCP.location_name}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50">
                    <span>{MCP.location.x}, {MCP.location.y}</span>
                    <EButton className="text-amber-500 text-lg hover:pr-2 transition-all active:opacity-60">
                        <FontAwesomeIcon icon={faLocation}/>
                    </EButton>
                </div>
            </section>

            <section className="mt-4">
                <h3 className="bg-slate-100 p-2 font-medium text-slate-700">Work Radius</h3>
                <div className="flex justify-between p-2 bg-slate-50">
                    <span>{MCP.work_radius} m</span>
                    <EButton className="text-amber-500 text-lg hover:pr-2 transition-all active:opacity-60">
                        <FontAwesomeIcon icon={faLocation}/>
                    </EButton>
                </div>
            </section>

            <section className="mt-4 shadow-sm">
                <h3 className="bg-slate-100 p-2 font-medium text-slate-700">Employees</h3>
                <div className="flex flex-col h-fit bg-slate-50 transition-all">
                    {mcpEmployees.map(employee => (
                        <div className="flex justify-between p-2"
                            key={employee.id}
                        >
                            <span className="text-slate-700">{employee.id} - {employee.fullname}</span>
                            <EButton className="text-red-400 hover:pr-2 active:opacity-60 transition-all"
                                onClick={() => handleUnAssignEmployee(employee.id)}
                            >
                                <FontAwesomeIcon icon={faClose}/>
                            </EButton>
                    </div> 
                    ))}
                    <div className="flex justify-between p-2">
                        <span className="text-slate-300">__________________</span>
                        <EButton className="text-teal-500 hover:pr-2 active:opacity-60 transition-all"
                            onClick={handleAssignEmployeePress}
                        >
                            <FontAwesomeIcon icon={faPenToSquare}/>
                        </EButton>
                    </div>
                </div>
            </section>

        </>
    )
}

export default memo(MCPDetail)