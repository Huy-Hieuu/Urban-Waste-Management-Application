const EmployeeModel = () => {
    let autoId = 0
    const create = (data) => {
        return {
            id: autoId++,
            hired_date: new Date().toLocaleDateString(),
            fullname: data.fullname,
            role: data.role,
            phone: data.phone,
            email: data.email,
            vehicle: data.vehicle || null,
            route: data.route || null,
            mcp: data.mcp || null,
        }
    }

    return {
        create
    }
}

export default EmployeeModel()