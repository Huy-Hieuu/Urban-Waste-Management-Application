import { createContext, useContext, useEffect, useReducer } from "react";
import employeeReducer from "./employeeReducer";
import { getMyEmployee } from "../../services/emlpoyeServices";

const EmployeeContext = createContext()

const useEmployeeContext = () => useContext(EmployeeContext)

const EmployeeProvider = ({children}) => {

    const [employees, dispatcher] = useReducer(employeeReducer, undefined)

    const handleFetchEmployee = () => {

        if (employees) return

        const fetchEmployee = async () => {
            try {
                const result = await getMyEmployee()
                dispatcher({type: 'get', data: result.data})
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchEmployee()
    }

    useEffect(handleFetchEmployee, [employees])

    console.log('inside employee context', employees)
    return (
        <EmployeeContext.Provider
            value={{
                employees,
                dispatcher
            }}
        >
            {children}
        </EmployeeContext.Provider>
    )
}

export { useEmployeeContext }
export default EmployeeProvider 