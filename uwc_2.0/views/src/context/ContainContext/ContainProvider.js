import { createContext, useContext, useEffect, useReducer } from "react";
import containReducer from "./containReducer"
import { getContains } from "../../services/mapService";

const ContainContext = createContext()
const useContainContext = () => useContext()

const ContainProvider = ({children}) => {

    const [ contains, dispatcher ] = useReducer(containReducer, undefined)

    const handleFetchContain = () => {

        if (contains) return 

        const fetchContains = async () => {
            try {
                const result = await getContains()
                dispatcher({type: 'get', data: result.data})
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchContains()
    }

    useEffect(handleFetchContain, [contains])

    return (
        <ContainContext.Provider 
            value={{contains, dispatcher}}
        >
            {children}
        </ContainContext.Provider>
    )
}

export default ContainProvider
export { useContainContext }