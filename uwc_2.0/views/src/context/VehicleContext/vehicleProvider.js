import { createContext, useContext, useEffect, useReducer } from "react";
import vehicleReducer from "./vehicleReducer";
import { getMyVehicle } from "../../services/vehicleServices";


const VehicleContext = createContext()

const useVehicleContext = () => useContext(VehicleContext)

const VehicleProvider = ({children, ...props}) => {

    const [ vehicles, dispatcher ] = useReducer(vehicleReducer, undefined)

    const handleFetchVehicles = () => {
        if (vehicles) return 

        const fetchEmployee = async () => {
            try {
                const result = await getMyVehicle()
                dispatcher({type: 'get', data: result.data})
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchEmployee()
    }

    useEffect(handleFetchVehicles, [vehicles])

    console.log('inside vehicle', vehicles)
    return (
        <VehicleContext.Provider 
            value={{vehicles, dispatcher}}
        >
            {children}
        </VehicleContext.Provider>
    )
}

export { useVehicleContext }
export default VehicleProvider