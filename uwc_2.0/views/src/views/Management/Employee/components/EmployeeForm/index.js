import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Modal from "../../../../../components/Modal"
import ModalCloseButton from "../../../../../components/ModalCloseButton"
import { useEmployeeContext } from "../../../../../context/EmployeeContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen } from "@fortawesome/free-solid-svg-icons"
import EButton from "../../../../../components/EButton"
import useIsMounted from "../../../../../hooks/useIsMounted"
import { updateMyEmployee } from "../../../../../services/emlpoyeServices"
import { addMyEmployee } from "../../../../../services/emlpoyeServices"
import LoadingModal from "../../../../../components/LoadingModal"


const EmployeeForm = ({
    employeeId=null,
    onClose = () => {}
}) => {

    const { register, setValue, handleSubmit, formState: { errors } } = useForm()
    const { employees, dispatcher } = useEmployeeContext()
    const [ loading, setLoading ] = useState(false)
    const isMounted = useIsMounted()

    const handleLoadInitData = () => {
        if (employeeId == null) return
        const employeeData = employees.find(e => e.id === employeeId)
        for (let formKey in employeeData) {
            setValue(formKey, employeeData[formKey])
        }
    }

    const onSubmit = async (data) => {
        console.log('submited')
        if (employeeId !== null) {
            try {
                setLoading(true)
                const result = await updateMyEmployee(employeeId, data)
                console.log('restult upadate" ', result)
                dispatcher({type: "patch", data: { id:employeeId, data: result.data}})
            }
            catch (e) {
                console.log(e)
            }
            if (isMounted()) {
                setLoading(false)
            }
            return
        }
        // Create
        try {
            setLoading(true)
            const result = await addMyEmployee(data)
            dispatcher({type: 'add', data: {data: result.data}})
        }

        catch (e) {
            console.log(e)
        }
        if (isMounted()) {
            setLoading(false)
        }
    }

    useEffect(handleLoadInitData, [employeeId, employees, setValue])

    return (
        <>
            {loading && <LoadingModal/>}
            <Modal>
                <div className="relative w-[500px] min-h-[400px] max-h-[600px] bg-white p-4">
                    <ModalCloseButton onClick={onClose}/>
                    <form className=" overflow-y-auto"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <h3 className="text-lg font-medium flex items-center gap-4">
                            <span className="flex items-center justify-center w-5 h-5 text-lg rounded-full bg-emerald-100 text-emerald-700">
                                <FontAwesomeIcon icon={faPen}/>
                        </span>
                        <span>Update Employee Information</span>
                        </h3>

                        <hr className="mb-2"/>

                        {employeeId ?
                        <p className="text-sm font-medium text-slate-500">
                            ! If you change your employee role, remember to reassign MCP or Route
                        </p>
                        :
                        <p className="text-sm font-medium text-slate-500">
                            You will need to assign schedule and MCP or Route to this employee later.
                        </p>}

                        <div className="flex flex-col bg-slate-100 gap-2 mb-4 mt-4">
                            <label className="text-sm font-semibold text-slate-600 pl-2">Full Name</label>
                            <input className="outline-none p-2 bg-slate-50"
                                placeholder="Nguyen Van A"
                                {...register('fullname', {required: true})}
                            />
                        </div>

                        <div className="flex flex-col bg-slate-100 gap-2 mb-4">
                            <label className="text-sm font-semibold text-slate-600 pl-2">Phone</label>
                            <input className="outline-none p-2 bg-slate-50"
                                placeholder="+84"
                                {...register('phone', {required: true})}
                            />
                        </div>

                        <div className="flex flex-col bg-slate-100 gap-2 mb-4">
                            <label className="text-sm font-semibold text-slate-600 pl-2">Email</label>
                            <input className="outline-none p-2 bg-slate-50"
                                placeholder="example@gmail.com"
                                {...register('email', {required: true})}
                            />
                        </div>

                        <div className="flex flex-col bg-slate-100 gap-2 mb-4">
                            <label className="text-sm font-semibold text-slate-600 pl-2">Role</label>
                                <select
                                    className="outline-none p-2 bg-slate-50"
                                    {...register('role', {required: true})}
                                >
                                    <option value="Janitor">Janitor</option>
                                    <option value="Collector">Collector</option>
                                </select>
                        </div>
                        <EButton className="bg-blue-400 hover:bg-blue-500 transition-colors text-white shadow-md w-full p-3 font-medium "
                            type="submit"
                        >
                            {employeeId ? "Update" : "Add"}
                        </EButton>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default EmployeeForm
