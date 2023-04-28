import AppMap from "./components/AppMap";
import EButton from "../../components/EButton";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import RouteList from "./components/RouteList";
import MCPList from "./components/MCPList";
import MapContext from "./context/MapContext";
import markerReducer from "./reducers/markerReducer";
import { useMcpContext } from "../../context/McpContext/McpProvider";
import Marker from "./mapAssets/Marker";
import circleReducer from "./reducers/circleReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import RouteCreateForm from "./components/RouteList/components/RouteCreateForm";
import L from "leaflet"

const DEFAULT_MAP_CENTER = [10.767062324608254, 106.66523784519231]
const DEFAULT_MAP_ZOOM = 15

const RouteMap = () => {

    const [ showRoute, setShowRoute ] = useState(false)
    const [ showRouteForm, setShowRouteForm ] = useState(false)

    const [ map, setMap ] = useState(undefined)
    const [ markers, markerDispatcher ] = useReducer(markerReducer, [])
    const [ circles, circleDispatcher ] = useReducer(circleReducer, [])
    const [ mapCenter, setMapCenter ] = useState(DEFAULT_MAP_CENTER)
    const [ mapZoom, setMapZoom ] = useState(DEFAULT_MAP_ZOOM)
    const { mcps } = useMcpContext()
    const routeControl = useRef()

    useEffect(() => {
        routeControl.current = L.Routing.control({
            // show: false,
            lineOptions: {
                styles: [{color: 'blue', opacity: 0.5, weight: 5}]
            },
            showAlternatives: false,
            addWaypoints: false, // Disable adding of waypoints
  draggableWaypoints: false, // Disable dragging of waypoints
  removeWaypoints: false, // Disable removing of waypoints
  routeWhileDragging: false, // Disable route calculation while dragging
  collapsible: true, // Allow collapsing of the control
  fitSelectedRoutes: true, // Fit the map to the selected route
  altLineOptions: null, // Hide alternative routes
  createMarker: function() { return null; } // Hide markers
        })
    }, [])

    const handleShowMCPMarkers = () => {
        if (markers.length) return
        const mcpMarkers = mcps?.map(mcp => {
            return Marker.create({
                position: [mcp.location.x, mcp.location.y], 
                popup: () => (
                    <>{mcp.name} <hr/> {mcp.location_name}</>
                ),
            })
        }) 
        if (mcpMarkers) {
            markerDispatcher({type: 'add', data: {data:mcpMarkers}})
        }
    }

    const handleCreateRoutePress = () => {
        setShowRouteForm(true)
    }
    const handleCloseCreateRoutePress = useCallback(() => {
        setShowRouteForm(false)
    }, [])

    const hanldeShowRoutePress = () => {
        setShowRoute(true)
    }

    const handleShowMcpPress = () => {
        setShowRoute(false)
    }

    useEffect(handleShowMCPMarkers, [mcps, markers.length])
   
    console.log('__rerender ROUTE_MAP')
    return (
        <MapContext.Provider
            value={{
                map, 
                setMap,
                markers,
                markerDispatcher,
                circles,
                circleDispatcher,
                mapCenter,
                setMapCenter,
                mapZoom, 
                setMapZoom,
                routeControl
            }}
        >
            <div className="flex gap-8 mt-16">
                
                <div className="flex-1">

                    <header className="mb-8">
                        <span className="block w-fit text-4xl font-semibold ">
                            Vehicle Management
                        </span>
                    </header>

                    {!showRouteForm && 
                    <ul className="h-10 flex gap-4 mb-4 pr-4">
                        <EButton className={`text-blue-400 px-4 font-medium ${showRoute && "bg-blue-400 text-white"} border-2 border-blue-400 active:opacity-60 transition-all`}
                            onClick={hanldeShowRoutePress}
                        >
                            Routes
                        </EButton>
                        <EButton className={`text-blue-400 px-4 font-medium ${!showRoute && "bg-blue-400 text-white"} border-2 border-blue-400 active:opacity-60 transition-all`}
                            onClick={handleShowMcpPress}
                        >
                            MCPs
                        </EButton>
                        <span className="flex-1"/>
                        {showRoute && 
                        <EButton className="bg-emerald-500 text-white p-2 font-medium flex gap-2 items-center hover:gap-3 w-[85px] active:opacity-60 transition-all"
                            onClick={handleCreateRoutePress}
                        >
                            Route
                            <FontAwesomeIcon icon={faAdd}/>
                        </EButton>}
                    </ul>}

                    {showRouteForm ?
                    <RouteCreateForm
                        onClose={handleCloseCreateRoutePress}
                    /> :
                     showRoute ?
                    <RouteList/>:
                    <MCPList/>}
                </div>

                <AppMap/>
            </div>
        </MapContext.Provider>
    );
}

export { DEFAULT_MAP_ZOOM, DEFAULT_MAP_CENTER }
export default RouteMap;
