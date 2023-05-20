import EmployeeModel from "../models/employee"

const getMyEmployee = () => {

    return new Promise(resolve => {

        setTimeout(()=> {
            resolve({data: [
                EmployeeModel.create({
                    fullname: "Bui Ngoc Nam Anh",
                    role: "Janitor",
                    phone: "0796518081",
                    email: "namanh@gmail.com",
                    hired_date: "2022/12/22",
                    vehicle: null
                }),
                EmployeeModel.create({
                    fullname: "Dai ngoc Quoc Trung",
                    role: "Collector",
                    phone: "0791111081",
                    email: "quoctrung@gmail.com",
                    hired_date: "2022/12/22",
                    vehicle: null
                }),
                EmployeeModel.create({
                    fullname: "Do Nguyen Huy Hieu",
                    role: "Janitor",
                    phone: "0913128081",
                    email: "huyhieu@gmail.com",
                    hired_date: "2022/12/22",
                    vehicle: null
                }),
                EmployeeModel.create({
                    fullname: "Nguyen Tien Phat",
                    role: "Janitor",
                    phone: "0123518081",
                    email: "tienphat@gmail.com",
                    hired_date: "2022/12/22",
                    vehicle: null
                }),
                EmployeeModel.create({
                    fullname: "Nguyen Duc Tuan",
                    role: "Collector",
                    phone: "0976518081",
                    email: "ductuan@gmail.com",
                    hired_date: "2022/12/22",
                    vehicle: null
                }),
                EmployeeModel.create({
                    fullname: "Cao Hoang Kiet",
                    role: "Collector",
                    phone: "0985518081",
                    email: "hoangkiet@gmail.com",
                    hired_date: "2022/12/22",
                    vehicle: null
                }),
                EmployeeModel.create({
                    fullname: "Nguyen Van Hung",
                    role: "Collector",
                    phone: "0655618081",
                    email: "vanhung@gmail.com",
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