import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Modal from "../../../../../components/Modal"
import ModalCloseButton from "../../../../../components/ModalCloseButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen } from "@fortawesome/free-solid-svg-icons"
import EButton from "../../../../../components/EButton"
import useIsMounted from "../../../../../hooks/useIsMounted"
import LoadingModal from "../../../../../components/LoadingModal"
import { useVehicleContext } from "../../../../../context/VehicleContext"
import { addVehicle, updateVehicle } from "../../../../../services/vehicleServices"


const VehicleForm = ({
    vehicleId=null,
    onClose = () => {}
}) => {

    const { register, setValue, handleSubmit, formState: { errors } } = useForm()
    const { vehicles, dispatcher } = useVehicleContext()
    const [ loading, setLoading ] = useState(false)
    const isMounted = useIsMounted()

    const handleLoadInitData = () => {
        if (vehicleId === null) return 
        const vehicleData = vehicles.find(e => e.id === vehicleId)
        for (let formKey in vehicleData) {
            setValue(formKey, vehicleData[formKey])
        }
    }

    const onSubmit = async (data) => {
        if (vehicleId !== null) {
            try {
                setLoading(true)
                const result = await updateVehicle(vehicleId, data)
                console.log('restult upadate" ', result)
                dispatcher({type: 'update', data: { id:vehicleId, data: result.data}})
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
            const result = await addVehicle(data)
            dispatcher({type: 'add', data: {data: result.data}})
        }
        
        catch (e) {
            console.log(e)
        }
        if (isMounted()) {
            setLoading(false)
        }
    }

    useEffect(handleLoadInitData, [vehicleId, vehicles, setValue])

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
                        <span>Update Vehicle Information</span>
                        </h3>

                        <hr className="mb-2"/>

                        {vehicleId ? null : 
                        <p className="text-sm font-medium text-slate-500 mb-2">
                            You can assign this vehicle to employee later.
                        </p>}

                        <div className="flex flex-col bg-slate-100 gap-2 mb-4">
                            <label className="text-sm font-semibold text-slate-600 pl-2">Type</label>
                                <select
                                    className="outline-none p-2 bg-slate-50"
                                    {...register('type', {required: true})}
                                >
                                    <option value="Truck">Truck</option>
                                    <option value="Troller">Troller</option>
                                </select>
                        </div>

                        <div className="flex flex-col bg-slate-100 gap-2 mb-4 mt-4">
                            <label className="text-sm font-semibold text-slate-600 pl-2">Capacity</label>
                            <input className="outline-none p-2 bg-slate-50"
                                placeholder="24 (kg)"
                                {...register('capacity', {required: true})}
                            />
                        </div>
                        
                        <div className="flex flex-col bg-slate-100 gap-2 mb-4">
                            <label className="text-sm font-semibold text-slate-600 pl-2">Driver</label>
                            <input className="outline-none p-2 bg-slate-50"
                                placeholder="Search employe..."
                                {...register('driver', {required: true})}
                            />
                        </div>

                        <EButton className="bg-blue-400 hover:bg-blue-500 transition-colors text-white shadow-md w-full p-3 font-medium "
                            type="submit"
                        >
                            {vehicleId ? "Update" : "Add"}
                        </EButton>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default VehicleForm 
