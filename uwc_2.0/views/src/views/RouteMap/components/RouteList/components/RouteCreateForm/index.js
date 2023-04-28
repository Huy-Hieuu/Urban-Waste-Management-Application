
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EButton from "../../../../../../components/EButton"
import { faChevronLeft, faClose } from "@fortawesome/free-solid-svg-icons"
import { useMapContext } from "../../../../context/MapContext"
import { useCallback, useEffect, useState } from "react"
import { useMcpContext } from "../../../../../../context/McpContext/McpProvider"
import Marker from "../../../../mapAssets/Marker"
import L from "leaflet"
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { useRouteContext } from '../../../../../../context/RouteContext'
import { addRoute } from '../../../../../../services/mapService'
import RouteModel from "../../../../../../models/route"
import LoadingModal from "../../../../../../components/LoadingModal"
import "leaflet-routing-machine";
import { DEPORT_LOCATION, DEPOT_POINT, TREATMENT_LOCATION, TREATMENT_POINT } from '../../../../../../models/mcps'
import axios from "axios"

const LeafIcon = L.Icon.extend({
        options: {}
})
const greenIcon = new LeafIcon({
    iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [50, 50]
})

const optimizeRoute = async (chosenMCPs) => {
    const body = {
        MCPs: {
            point0: {
                ID: 0,
                isAvailable: chosenMCPs.includes(0)
            },
            point1: {
                ID: 1,
                isAvailable: chosenMCPs.includes(1)
            },
            point2: {
                ID: 2,
                isAvailable: chosenMCPs.includes(2)
            },
            point3: {
                ID: 3,
                isAvailable: chosenMCPs.includes(3)
            },
            point4: {
                ID: 4,
                isAvailable: chosenMCPs.includes(4)
            },
            point5: {
                ID: 5,
                isAvailable: chosenMCPs.includes(5)
            }
        }
    }
    return axios.post('http://127.0.0.1:8080/api/optimizer/postRoute/', body)
}

const RouteCreateForm = ({
    onClose,
    ...props
}) => {

    const { markerDispatcher, map, routeControl } = useMapContext()
    const [ chosenMcps, setChosenMcps ] = useState([])
    const [ routeNameValue, setRouteNameValue ] = useState("Route " + RouteModel.getNextId())
    const { dispatcher: routeDispatcher } = useRouteContext()
    const { mcps } = useMcpContext()
    const [ created, setCreated ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const handleClearWayPoints = () => {
        const routeControlRef = routeControl.current
        return () => {
            if (created) {
                routeControlRef.setWaypoints([])
            }
        }
    }

    const onFinishForm = () => {
        return () => {
            markerDispatcher({type: 'reset'})
        }
    }

    const handleUnSelectMcp = useCallback((id) => {
        setChosenMcps(prev => {
            return prev.filter(m => m !== id)
        })
    }, [])

    const handleInitMapSelector = () => {
        const mcpMarkers = mcps?.map(mcp => {
            const markerIcon = chosenMcps.includes(mcp.id) ? {icon: greenIcon}:{}
            const eventHandlersProp = created ? {} : {
                eventHandlers: {
                    // ...iconProp,
                    click: () => {
                        setChosenMcps(prev => {
                            if (prev.includes(mcp.id)) {
                                return prev.filter(m=>m !== mcp.id)
                            }
                            else return [...prev, mcp.id]
                        })
                    }
                }
            }

            return Marker.create({
                ...markerIcon,
                ...eventHandlersProp,
                position: [mcp.location.x, mcp.location.y],
                tooltip: mcp.name + '-' + mcp.location_name,
            })
        })

        if (mcpMarkers) {
            markerDispatcher({type: 'set', data: mcpMarkers})
        }
    }

    const handleSubmitPress = async () => {
        try {
            setLoading(true)
            const { data: result } = await optimizeRoute(chosenMcps)
            const orderedMcpIds = result.slice(1, -1)

            const { data } = await addRoute({
                name: routeNameValue,
                contains:orderedMcpIds 
            })
            
            setChosenMcps(orderedMcpIds)
            routeDispatcher({type: 'add', data: {data}})
            setCreated(true)

            const wayPoints = orderedMcpIds.map(cmId => {
                const mcp = mcps.find(m => m.id===cmId)
                return L.latLng(mcp.location.x, mcp.location.y)
            })   
            routeControl.current.setWaypoints([
                DEPOT_POINT,
                ...wayPoints,
                TREATMENT_POINT
            ]).addTo(map.target)
        }
        catch (e) {
            const { data } = await addRoute({
                name: routeNameValue,
                contains: chosenMcps
            })
            console.log(e)
            routeDispatcher({type: 'add', data: {data}})
            setCreated(true)

            const wayPoints = chosenMcps.map(cmId => {
                const mcp = mcps.find(m => m.id===cmId)
                return L.latLng(mcp.location.x, mcp.location.y)
            })   
            routeControl.current.setWaypoints([
                DEPOT_POINT,
                ...wayPoints,
                TREATMENT_POINT
            ]).addTo(map.target)
        }
        setLoading(false)
    }

    useEffect(handleInitMapSelector, [markerDispatcher, mcps, chosenMcps, created])
    useEffect(onFinishForm, [markerDispatcher])
    useEffect(handleClearWayPoints, [created, routeControl])

    return (
        <>
            {loading && <LoadingModal/>}
            <div className="flex-1">
                <div className="flex justify-between mr-4">
                    <EButton className="py-2 px-8 text-white bg-rose-400 min-w-[90px] group active:opacity-60 transition-opacity" 
                        onClick={onClose}
                    >
                        <FontAwesomeIcon className="group-hover:-translate-x-2 transition-all" icon={faChevronLeft}/>
                    </EButton>
                    {chosenMcps.length > 1 && 
                    <EButton className="py-2 px-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-all"
                        onClick={handleSubmitPress}
                    >
                        Optimize Route
                    </EButton>}
                </div>
                <h3 className="mt-4 text-red-400">Choose MCP on the Map</h3>
                <h3 className="text-lg font-medium text-emerald-500">Route Name</h3>
                <input className="bg-slate-50 p-4 outline-none w-full mr-4 ring-2 mt-2"
                    disabled={created}
                    value={routeNameValue} 
                    onChange={(e) => setRouteNameValue(e.target.value)}
                />
                <ul className="flex flex-col mt-4">
                    {chosenMcps.map(mcpId => {
                        const mcp = mcps.find(m => m.id === mcpId)
                        return (
                        <ChosenMcpItem
                            key={mcp.id}
                            data={mcp}
                            onUnselect={handleUnSelectMcp}
                            created={created}
                        />
                        )
                    })}
                </ul>
            </div>
        </>
    )
}

const ChosenMcpItem = ({data, onUnselect, created}) => {

    const handleUnSelect = () => {
        onUnselect(data.id)
    }

    return (
        <div className='bg-slate-50 h-14 font-medium text-slate-700 text-lg grid grid-cols-[100px_1fr_50px]'>
            <h3 className='text-slate-500 m-auto'>{data.name}</h3>
            <h3 className='my-auto ml-4'>{data.location_name}</h3>
            <EButton className="text-red-400 w-full h-full hover:-translate-x-2 transition-all "
                disabled={created}
                onClick={handleUnSelect}
            >
                <FontAwesomeIcon icon={faClose} />
            </EButton>
        </div>
    )
}

export default RouteCreateForm