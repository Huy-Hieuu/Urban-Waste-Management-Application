import pkg from 'pg';
const {Pool} = pkg;

const db = new Pool({
    host:'localhost',
    user:'postgres',
    database: 'uwc_db',
    password: 'hieu1905',
    port: 5432,
})
db.connect()
    .then(() => {
        console.log('Connected to PostgreSQL');
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL', err);
    });

export default db;