import db from './db.js';

export const employeeController = {

    getAllEmployees: (req,res) =>{
        const q = `select id, name, role, phone, email, start_date from user_system,employee where user_system.id = employee.user_id`;
        db.query(q, (err, data) => {
            if(err) res.status(500).json({ message: 'Error retrieving employee' });
            return res.status(200).json(data.rows)
        })
    },

    getEmployeeByID: (req, res) => {
        const {id} = req.params;
        const q = `select id, name, role, phone, email, start_date from user_system, employee
                    where employee.user_id = $1 and user_system.id = $1`
        db.query(q, [id], (err,data) => {
            if(err) return res.status(500).json({message : `Error Getting employee Id = ${id}`})
            return res.status(200).json(data.rows)
        })
    },

    postEmployee: (req,res) => {
        const q = `INSERT INTO employee VALUES ($1, $2, $3, $4, $5, $6)`;
        console.log(req.body)
        const values = [
            req.body.user_id,
            req.body.manager_id,
            req.body.vehicle_id,
            req.body.role,
            req.body.start_date,
            req.body.salary
        ];
        db.query(q, values, (err,data) => {
            if(err) return res.status(500).json({message : err})
            return res.status(200).json('Vehicle is created successfully')
        })
    },

    deleteEmployee: (req,res) => {
        const {id} = req.params;
        console.log('Employee ID:', id);
        const q = "delete from employee where user_id = $1";

        db.query(q, [id], (err,data) => {
            if(err) {
                console.log(err)
                return res.status(500).json({message : 'Error Deleting employee'})
            }
            console.log(data)
            return res.status(200).json('Employee is deleted successfully')
        })
    },


    updateEmployee: (req,res) => {
        const {id} = req.params;
        // const q = "INSERT INTO user_system (`id`, `username`, `password`, `name`, `is_backofficer`, `is_active`, `address`, `birth`, `gender`, `phone`, `email`, `last_login`) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) on duplicate key update id = values(id), username = values(username), password = values(password), name=values(name), is_backofficer=values(is_backofficer), is_active=values(is_active), address=values(address), birth=values(birth), gender=values(gender), phone=values(phone), email = values(email), last_login =values(last_login)";
        // const q = "insert into employee(`id`,`name`, `role`, `email`, `phoneNumber`,`hired_date`) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), email = VALUES(email), phoneNumber = VALUES(phoneNumber), hired_date = VALUES(hired_date)";
        const q = `INSERT INTO employee(user_id, manager_id, vehicle_id, role, start_date, salary)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    ON CONFLICT (user_id)
                    DO UPDATE SET
                    manager_id = EXCLUDED.manager_id,
                    vehicle_id = EXCLUDED.vehicle_id,
                    role = EXCLUDED.role,
                    start_date = EXCLUDED.start_date,
                    salary = EXCLUDED.salary`;
        const values = [id, req.body.manager_id, req.body.vehicle_id, req.body.role, req.body.start_date, req.body.salary];

        db.query(q, values, (err, data) => {
          if(err) return res.status(500).json({message : err})
          return res.status(200).json('Employee is updated successfully')
        });
    },
}



