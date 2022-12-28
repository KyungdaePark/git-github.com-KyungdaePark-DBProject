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
      ).then().catch((error) => {
        console.error(error);
      });
      return rows
    },

  getssn: async (ussn, role) => {
    if(role == "ADMIN"){
      const [rows] = await promisePool.query(
        `SELECT salesperson.Sid FROM salesperson,user WHERE Usn = ? AND SUser_Id = User_Id;`, [ussn]
      ).then().catch((error) => {
        console.error(error);
      });
      return rows
    }
    else if(role == "CUSTOMER"){
      const [rows] = await promisePool.query(
        `SELECT customer.Ssn FROM customer,user WHERE Usn = ? AND CUser_Id = User_Id;`, [ussn]
      ).then().catch((error) => {
        console.error(error);
      });
      return rows
    } 
  },

  getUsersInfo: async (id, role) => {
    if(role == "ADMIN"){
      const [rows] = await promisePool.query(
        `SELECT * FROM salesperson WHERE Sid = ?;`, [id]
      ).then().catch((error) => {
        console.error(error);
      });
      return rows
    }
    else if(role == "CUSTOMER"){
      const [rows] = await promisePool.query(
        `SELECT * FROM customer WHERE Ssn = ?;`, [id]
      ).then().catch((error) => {
        console.error(error);
      });
      return rows
    }
  },

  getBookedCar: async (id) => {
    const [rows] = await promisePool.query(
      `SELECT * FROM sale,vehicle,vehicle_info WHERE SSsn = ? AND svin = vin AND vehicle_info_id = info_id;`,
      [id]
    ).then().catch((error) => {
      console.error(error);
    });
    return rows;
  },
  
  getAllVehicles: async() => {
    const [rows] = await promisePool.query(
      `SELECT * FROM vehicle ORDER BY Vin;`
    ).then().catch((error) => {
      console.error(error);
    });
    return rows;
  },

  getAllVehicleInfos: async () => {
    const [rows] = await promisePool.query(
      `SELECT * FROM vehicle_info ORDER BY Company, Model_Name;`
    ).then().catch((error) => {
      console.error(error);
    });
    return rows;
  },

  getACar: async(vin) => {
    const[rows] = await promisePool.query(
      `SELECT * FROM vehicle, vehicle_info WHERE vin = ? AND vehicle_info_id = info_id;`, [vin]
    ).then().catch((error) => {
      console.error(error);
    });
    return rows;
  },

  getCanbuyCars: async () => {
    const [rows] = await promisePool.query(
      // `SELECT * 
      //  FROM sale, vehicle, vehicle_info 
      //  WHERE SSsn IS NULL AND BookDate IS NULL and vin = svin and vehicle_info_id = info_id AND Saled=FALSE;`
      `SELECT * FROM possible_booking_view;`
    ).then().catch((error) => {
      console.error(error);
    });
    return rows;
  },

  getBookedCars: async (ssid) => {
    const [rows] = await promisePool.query(
      `SELECT * 
       FROM sale, vehicle, vehicle_info, customer, salesperson 
       WHERE SSid = ? AND Ssn = SSsn AND Sid = SSid AND SSsn IS NOT NULL AND SVin = Vin AND vehicle_info_id = info_id;`,
      [ssid]
    ).then().catch((error) => {
      console.error(error);
    });
    return rows;
  },

  getMycars: async(ssid) => {
    const [rows] = await promisePool.query(
      `SELECT SVin, SSsn, BookDate FROM Sale WHERE SSid = ? ORDER BY Svin;`, [ssid]
    ).then().catch((error) => {
      console.error(error);
    });
    return rows;
  },

  getAVehicle: async(vin) => {
    const [rows] = await promisePool.query(
      `SELECT * FROM Vehicle WHERE Vin = ?`, [vin]
    ).then().catch((error) => {
      console.error(error);
    });
    return rows;
  }
}

export const updateSql = {
  setBooking : async (sssn, vin, bookdate) => {
    const[rows] = await promisePool.query(
      `SELECT SSsn, BookDate FROM Sale WHERE SVin = ?;`, [vin]
    ).then().catch((error) => {
      console.error(error);
    });
    if(rows[0].SSsn == null && rows[0].BookDate == null){
      await promisePool.query(
        `UPDATE sale SET SSsn = ?, BookDate = ? WHERE SVin = ?;`,
        [sssn, bookdate, vin]
      ).then().catch((error) => {
        console.error(error);
      });
      return 0;
    }
    else return -1;
  },

  eraseBooking : async (vin) => {
    await promisePool.query(
      `UPDATE sale SET SSsn=NULL, BookDate=NULL WHERE SVin = ?;`,
      [vin]
    ).then().catch((error) => {
      console.error(error);
    });
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
    ).then().catch((error) => {
      console.error(error);
    });
  },

  updateVehicle : async (vehicle_data) => {
    const vin = vehicle_data.newvin==''?null:vehicle_data.newvin;
    const price = vehicle_data.newprice==''?null:vehicle_data.newprice;
    const saled = vehicle_data.Saled==''?null:vehicle_data.Saled;
    await promisePool.query(
      `UPDATE vehicle SET Price=?, Saled=? WHERE Vin=?;`,
      [price, saled, vin]
    ).then().catch((error) => {
      console.error(error);
    });
  },

  updateSale: async (data) => {
    const vin = data.SVin==''?null:data.SVin;
    const sssn = data.SSsn==''?null:data.SSsn;
    const bookdate = data.Bookdate==''?null:data.Bookdate;
    const saleid = data.Sale_Id;
    await promisePool.query(
      `UPDATE sale SET SSsn = ?, BookDate = ? where Sale_Id = ? AND SVin = ?;`,
      [sssn, bookdate, saleid, vin]
    ).then().catch((error) => {
      console.error(error);
    });
  }
}

export const deleteSql = {
  deleteVehicleInfo : async (info_id) => {
    await promisePool.query(
      `DELETE FROM Vehicle_Info WHERE Info_Id = ?;`,
      [info_id]
    ).then().catch((error) => {
      console.error(error);
    });
  },

  deleteVehicle : async (Vin) => {
    await promisePool.query(
      `DELETE FROM Vehicle WHERE Vin = ?;`,
      [Vin]
    ).then().catch((error) => {
      console.error(error);
    });
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
    ).then().catch((error) => {
      console.error(error);
    });
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
    ).then().catch((error) => {
      console.error(error);
    });
  }
}