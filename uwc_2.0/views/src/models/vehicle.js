

const VehicleModal = () => {

    let autoIncreaseId = 0

    const create = (data) => ({
        id: autoIncreaseId++,
        capacity: data.capacity,
        load: data.load,
        type: data.type,
        driver: data.driver || null,
        driver_name: data.driver_name || null,
        route: null,
        MCP: null
    })

    return {
        create
    }
}

export default VehicleModal()