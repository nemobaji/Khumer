import { Pool } from "pg";

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'KhuMer',
    password: 'nemobaji1028@',
    port: 5432,
});

pool.once('connect', () => {
    console.log('> crawler server connected to PostgreSQL');
})

export default pool;