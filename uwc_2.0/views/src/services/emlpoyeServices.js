import EmployeeModel from "../models/employee"

const getMyEmployee = () => {

    return new Promise(resolve => {

        setTimeout(()=> {
            resolve({data: [
                EmployeeModel.create({
                    fullname: "Bui Ngoc Nam Anh", 
                    role: "Janitor", 
                    phone: "0796518081", 
                    email: "namanhble14012002@gmail.com",
                    hired_date: "2022/12/22", 
                    vehicle: null
                }),
                EmployeeModel.create({
                    fullname: "Dai ngoc Quoc Trung", 
                    role: "Collector", 
                    phone: "0796518081", 
                    email: "namanhble14012002@gmail.com",
                    hired_date: "2022/12/22",
                    vehicle: null
                }),
            ]})
        }, 1000)
    })
}

const deleteMyEmployee = (id) => {
    return new Promise(resolve => {
        setTimeout(resolve, 1000)
    })
}

const updateMyEmployee = (id, data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({data})
        }, 1000)
    })
}

const addMyEmployee = (data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({data: EmployeeModel.create(data)})
        }, 1000)
    })
}

export { getMyEmployee, deleteMyEmployee, updateMyEmployee, addMyEmployee }