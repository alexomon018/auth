import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: `${process.env.POSTGRES_CONNECTION_STRING}`,
});
const query = (text, params) => pool.query(text, params);

export { pool, query };
