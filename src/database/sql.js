import mysql from "mysql2";

// 데이터베이스 연결
const pool = mysql.createPool(
  process.env.JAWSDB_URL ?? {
    host: 'localhost',
    user: 'root',
    database: 'Car_Dealer',
    password: '1234',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
);
// async / await 사용
const promisePool = pool.promise();

export const selectSql = {
  getUsers: async () => {
    const [rows] = await promisePool.query(
      `SELECT * FROM USER`
    )
    return rows
  },

  getUsersInfo: async (id, role) => {
    if(role == "ADMIN"){
      const [rows] = await promisePool.query(
        `SELECT * FROM salesperson WHERE Sid = ?;`, [id]
      )
      return rows
    }
    else if(role == "CUSTOMER"){
      const [rows] = await promisePool.query(
        `SELECT * FROM customer WHERE Ssn = ?;`, [id]
      )
      return rows
    }
  },
  getAllCars: async () => {
    const [rows] = await promisePool.query(
      `SELECT * FROM vehicle;`
    )
    return rows;
  },

  getCanbuyCars: async () => {
    const [rows] = await promisePool.query(
      `SELECT * FROM sale, vehicle, vehicle_info WHERE SSsn IS NULL AND BookDate IS NULL and vin = svin and vehicle_info_id = info_id;`
    )
    return rows;
  }
}