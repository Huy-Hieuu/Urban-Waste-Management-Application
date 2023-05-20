import VehicleModal from "../models/vehicle"

const getMyVehicle = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                data: [
                    VehicleModal.create({
                        capacity: 50,
                        driver_name: 'Tien Phat',
                        load: 0.0,
                        type: 'Truck',
                    }),
                    VehicleModal.create({
                        capacity: 40,
                        driver_name: 'Nguyen Tuan',
                        load: 0.4,
                        type: 'Truck',
                    }),
                    VehicleModal.create({
                        capacity: 70,
                        driver_name: 'Huy Hieu',
                        load: 0.8,
                        type: 'Troller',
                    }),
                    VehicleModal.create({
                        capacity: 70,
                        driver_name: 'Hoang Kiet',
                        load: 0.8,
                        type: 'Troller',
                    }),
                ]
            })
        }, 1000);
    })
}

const addVehicle = (data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({data:VehicleModal.create(data)})
        }, 1000)
    })
}

const updateVehicle = (id, data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({data})
        }, 1000);
    })
}

const deleteMyVehicle = (id) => {
    return new Promise(resolve => {
        setTimeout(resolve, 1000);
    })
}

export { addVehicle, updateVehicle, deleteMyVehicle, getMyVehicle }