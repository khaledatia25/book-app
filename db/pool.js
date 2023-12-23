const {Pool} = require('pg');
const dotenv  = require('dotenv');
dotenv.config();
const db_config = {
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 300,
    idleTimeoutMillis: 200,
    max: 200,
}
const pool = new Pool(db_config);
pool.on('connect',()=>{
    console.log('Database connected');
});
pool.on('remove',()=>{
    console.log('Database connection remved');
});
// pool.on('error',(e)=>{
//     console.log('Error'+e.stack);
// });
module.exports = pool;