import db from './db.js';

export const vehicleController = {
    getAllVehicles: (req,res) =>{
        const q = "select asset_id, type, capacity, load from vehicle, main_asset where vehicle.asset_id = main_asset.id";
        db.query(q, (err, data) => {
            if(err) res.status(500).json({ message: 'Error retrieving vehicles' });
            return res.status(200).json(data.rows)
        })
    },

    getVehicleByID: (req, res) => {
        const {id} = req.params;
        const q = `select asset_id, type, capacity, load from vehicle, main_asset where vehicle.asset_id = main_asset.id and vehicle.asset_id = $1`
        db.query(q, [id], (err,data) => {
            if(err) return res.status(500).json({message : `Error Getting vehicle Id = ${id}`})
            return res.status(200).json(data.rows)
        })
    },

    postVehicle: (req,res) => {
        const q = "insert into vehicle(asset_id, type) values($1, $2)"
        const values = [
            req.body.id,
            req.body.type
        ];
        db.query(q, values, (err,data) => {
            if(err) return res.status(500).json({message : 'Error Posting vehicle'})
            return res.status(200).json('Vehicle is created successfully')
        })
    },

    deleteVehicle: (req,res) => {
        const {id} = req.params;
        console.log('Vehicle ID:', id);
        const q = "delete from vehicle where asset_id = $1";

        db.query(q, [id], (err,data) => {
            if(err) {
                console.log(err)
                return res.status(500).json({message : 'Error Deleting vehicle'})
            }
            console.log(data)
            return res.status(200).json('Vehicle is deleted successfully')
        })
    },


    updateVehicle: (req,res) => {
        const {id} = req.params;
        const q = `insert into vehicle(asset_id, type)
                    values($1, $2)
                    on conflict (asset_id)
                    do update set
                    type = excluded.type`;
        const values = [id, req.body.type];

        db.query(q, values, (err, data) => {
            if(err) return res.status(500).json({message : 'Error Updating vehicle'})
            return res.status(200).json('Vehicle is updated successfully')
        });
    },
}



