import { createContext, useContext, useEffect, useReducer } from "react";
import routeReducer from "./routeReducer";
import { getRoutes } from "../../services/mapService";

const RouteContext = createContext()
const useRouteContext = () => useContext(RouteContext)


const RouteProvider = ({children}) => {

    const [ routes, dispatcher ] = useReducer(routeReducer, undefined)

    const handleFetchRoutes = () => {
        const fetchRoutes = async () => { 
            try {
                const result = await getRoutes()
                dispatcher({type: 'get', data: result.data})
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchRoutes()
    }

    useEffect(handleFetchRoutes, [])

    return (
        <RouteContext.Provider
            value={{
                routes,
                dispatcher
            }}
        >
            {children}
        </RouteContext.Provider>
    )
}

export default RouteProvider
export { useRouteContext }