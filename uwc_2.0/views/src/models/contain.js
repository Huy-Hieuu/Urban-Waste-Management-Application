

const ContainModel = () => { // relation
    let autoIncreaseId = 0
    const create = (data) => ({
        id: autoIncreaseId++,
        route: data.route || null,
        mcp: data.mcp || null,
        order: data.order || null
    })
    return {create}
}

export default ContainModel()