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

  getssn: async (ussn, role) => {
    if(role == "ADMIN"){
      const [rows] = await promisePool.query(
        `SELECT salesperson.Sid FROM salesperson,user WHERE Usn = ? AND SUser_Id = User_Id;`, [ussn]
      )
      return rows
    }
    else if(role == "CUSTOMER"){
      const [rows] = await promisePool.query(
        `SELECT customer.Ssn FROM customer,user WHERE Usn = ? AND CUser_Id = User_Id;`, [ussn]
      )
      return rows
    } 
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

  getBookedCar: async (id) => {
    const [rows] = await promisePool.query(
      `SELECT * FROM sale,vehicle,vehicle_info WHERE SSsn = ? AND svin = vin AND vehicle_info_id = info_id;`,
      [id]
    )
    return rows;
  },
  
  getAllVehicles: async() => {
    const [rows] = await promisePool.query(
      `SELECT * FROM vehicle, sale WHERE SVin = Vin ORDER BY Vin;`
    )
    return rows;
  },

  getAllVehicleInfos: async () => {
    const [rows] = await promisePool.query(
      `SELECT * FROM vehicle_info;`
    )
    return rows;
  },

  getACar: async(vin) => {
    const[rows] = await promisePool.query(
      `SELECT * FROM vehicle, vehicle_info WHERE vin = ? AND vehicle_info_id = info_id;`, [vin]
    )
    return rows;
  },

  getCanbuyCars: async () => {
    const [rows] = await promisePool.query(
      `SELECT * FROM sale, vehicle, vehicle_info WHERE SSsn IS NULL AND BookDate IS NULL and vin = svin and vehicle_info_id = info_id AND Saled=FALSE;`
    )
    return rows;
  },

  getBookedCars: async (ssid) => {
    const [rows] = await promisePool.query(
      `SELECT * FROM sale, vehicle, vehicle_info, customer, salesperson WHERE SSid = ? AND Ssn = SSsn AND Sid = SSid AND SSsn IS NOT NULL AND SVin = Vin AND vehicle_info_id = info_id;`,
      [ssid]
    )
    return rows;
  },

  getVins: async() => {
    const [rows] = await promisePool.query(
      `SELECT Vin FROM Vehicle;`
    )
    return rows;
  },

  getMycars: async(ssid) => {
    const [rows] = await promisePool.query(
      `SELECT SVin, SSsn, BookDate FROM Sale WHERE SSid = ? ORDER BY Svin;`, [ssid]
    )
    return rows;
  },

  getCustomers: async(ssid) => {
    const [rows] = await promisePool.query(
      `SELECT DISTINCT Sale_Id, Cname, Cemail FROM customer, sale WHERE SSsn = Ssn AND SSid=?;`, [ssid]
    )
    return rows;
  },

  getSalesperson: async(ssid) => {
    const [rows] = await promisePool.query(
      `SELECT DISTINCT Sname, Semail FROM Salesperson WHERE Sid=?;`, [ssid]
    )
    return rows;
  },

  getassn: async(cname) => {
    const [rows] = await promisePool.query(
      `SELECT Ssn FROM Customer WHERE Cname = ?;`, [cname]
    )
    return rows;
  }
}

export const updateSql = {
  setBooking : async (sssn, vin, bookdate) => {
    await promisePool.query(
      `UPDATE sale SET SSsn = ?, BookDate = ? WHERE SVin = ?;`,
      [sssn, bookdate, vin]
    )
  },

  eraseBooking : async (vin) => {
    await promisePool.query(
      `UPDATE sale SET SSsn=NULL, BookDate=NULL WHERE SVin = ?;`,
      [vin]
    )
  },

  updateVehicleInfo : async (vehicle_info_data, INFO_ID) => {
    const company = vehicle_info_data.Company==''?null:vehicle_info_data.Company;
    const model_name = vehicle_info_data.Model_Name==''?null:vehicle_info_data.Model_Name;
    const engine_capacity = vehicle_info_data.Engine_Capacity==''?null:vehicle_info_data.Engine_Capacity;
    const tonnage = vehicle_info_data.Tonnage==''?null:vehicle_info_data.Tonnage;
    const color = vehicle_info_data.Color==''?null:vehicle_info_data.Color;
    const year = vehicle_info_data.Year==''?null:vehicle_info_data.Year;
    await promisePool.query(
      `UPDATE vehicle_info SET Company=?, Model_Name=?, Engine_Capacity=?, Tonnage=?, Color=?, Year=? WHERE INFO_ID = ?;`,
      [company, model_name, engine_capacity, tonnage, color, year, INFO_ID]
    )
  },

  updateVehicle : async (vehicle_data) => {
    const OriginVin = vehicle_data.OriginVin==''?null:vehicle_data.OriginVin;
    const vin = vehicle_data.Vin==''?null:vehicle_data.Vin;
    const price = vehicle_data.Price==''?null:vehicle_data.Price;
    const saled = vehicle_data.Saled==''?null:vehicle_data.Saled;
    const info_id = vehicle_data.Vehicle_Info_Id==''?null:vehicle_data.Vehicle_Info_Id;
    const ssid = vehicle_data.SSid==''?null:vehicle_data.SSid;
    await promisePool.query(
      `UPDATE vehicle SET Vin=?, Price=?, Saled=?, Vehicle_Info_Id = ? WHERE Vin=?;`,
      [vin, price, saled, info_id, OriginVin]
    )

    await promisePool.query(
      `UPDATE sale SET SSid = ? WHERE SVin = ?`,
      [ssid, vin]
    )
  },

  updateSale: async (data) => {
    const vin = data.SVin==''?null:data.SVin;
    const sssn = data.SSsn==''?null:data.SSsn;
    const bookdate = data.Bookdate==''?null:data.Bookdate;
    const saleid = data.Sale_Id;
    await promisePool.query(
      `UPDATE sale SET SSsn = ?, BookDate = ? where Sale_Id = ? AND SVin = ?;`,
      [sssn, bookdate, saleid, vin]
    )
  }
}

export const deleteSql = {
  deleteVehicleInfo : async (info_id) => {
    await promisePool.query(
      `DELETE FROM Vehicle_Info WHERE Info_Id = ?;`,
      [info_id]
    )
  },

  deleteVehicle : async (Vin) => {
    await promisePool.query(
      `DELETE FROM Vehicle WHERE Vin = ?;`,
      [Vin]
    )
  }
}

export const insertSql = {
  insertVehicleInfo : async (vehicle_info_data) => {
    const company = vehicle_info_data.Company==''?null:vehicle_info_data.Company;
    const model_name = vehicle_info_data.Model_Name==''?null:vehicle_info_data.Model_Name;
    const engine_capacity = vehicle_info_data.Engine_Capacity==''?null:vehicle_info_data.Engine_Capacity;
    const tonnage = vehicle_info_data.Tonnage==''?null:vehicle_info_data.Tonnage;
    const color = vehicle_info_data.Color==''?null:vehicle_info_data.Color;
    const year = vehicle_info_data.Year==''?null:vehicle_info_data.Year;
    await promisePool.query(
      `INSERT INTO vehicle_info (Company, Model_Name, Engine_Capacity, Tonnage, Color, Year) VALUES (?, ?, ?, ?, ?, ?);`,
      [company, model_name, engine_capacity, tonnage, color, year]
    )
    await promisePool.query(
      `INSERT INTO Sale`
    )
  },

  insertVehicle : async (vehicle_data) => {
    const vin = vehicle_data.Vin==''?null:vehicle_data.Vin;
    const price = vehicle_data.Price==''?null:vehicle_data.Price;
    const saled = vehicle_data.Saled==''?null:vehicle_data.Saled;
    const info_id = vehicle_data.Vehicle_Info_Id==''?null:vehicle_data.Vehicle_Info_Id;
    const salesperson = vehicle_data.Salesperson==''?null:vehicle_data.Salesperson;
    await promisePool.query(
      `INSERT INTO Vehicle (Vin, Price, Saled, Vehicle_Info_Id) VALUES (?, ?, ?, ?);`,
      [vin, price, saled, info_id]
    )
    await promisePool.query(
      `INSERT INTO Sale (SSid, SVin, SSsn, BookDate) VALUES (?,?,NULL,NULL);`,
      [salesperson, vin]
    )
  }
}