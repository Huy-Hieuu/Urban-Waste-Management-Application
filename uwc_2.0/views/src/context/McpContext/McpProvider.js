import { createContext, useContext, useEffect, useReducer } from "react";
import mcpReducer from "./mcpReducer";
import { getMcps } from "../../services/mapService";



const McpContext = createContext()
const useMcpContext = () => useContext(McpContext)


const McpProvider = ({children}) => {

    const [ mcps, dispatcher ] = useReducer(mcpReducer)

    const handleFetchMcps = () => {
        const fetchMcps = async () => {
            try {
                const result = await getMcps()
                dispatcher({type: 'get', data: result.data})
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchMcps()
    }

    useEffect(handleFetchMcps, [])

    return (
        <McpContext.Provider
            value={{mcps, dispatcher}}
        >
            {children}
        </McpContext.Provider>
    )
}

export default McpProvider
export { useMcpContext }