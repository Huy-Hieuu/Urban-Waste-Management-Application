
const MapCirCle = () => {
    let autoIncreaseId = 0
    return {
        create: (data) => ({
            id: autoIncreaseId++,
            ...data
        }),
        getNextId: () => autoIncreaseId
    }
}

export default MapCirCle()