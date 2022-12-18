CREATE DATABASE Car_Dealer;
use Car_Dealer;

CREATE TABLE SALESPERSON
(
    Sid INT NOT NULL AUTO_INCREMENT,
    SUser_Id VARCHAR(20) NOT NULL,
    Sname VARCHAR(20) NOT NULL,
    SEmail VARCHAR(30) NOT NULL,
UNIQUE(SUser_Id),
PRIMARY KEY (Sid),
CONSTRAINT CHk_Email CHECK(
    REGEXP_LIKE(SEmail, '^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9._-]@[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]\\.[a-zA-Z]{2,4}$'))
);

CREATE TABLE VEHICLE_INFO
(
    INFO_ID INT NOT NULL AUTO_INCREMENT,
    Company VARCHAR(20) NOT NULL,
    Model_Name VARCHAR(20) NOT NULL,
    Engine_Capacity INT,
    Tonnage INT,
    Color VARCHAR(20) NOT NULL,
    Year YEAR NOT NULL,
PRIMARY KEY(INFO_ID)
);

CREATE TABLE VEHICLE
(
    Vin VARCHAR(20) NOT NULL,
    Price INT NOT NULL,
    Saled Boolean NOT NULL,
    Vehicle_Info_Id INT NOT NULL,
PRIMARY KEY (Vin),
FOREIGN KEY (Vehicle_Info_Id) REFERENCES VEHICLE_INFO(INFO_ID) ON DELETE CASCADE-- 자동차 정보 테이블과 1:1 관계
);

CREATE TABLE CUSTOMER
(
    Ssn INT NOT NULL AUTO_INCREMENT,
    CUser_Id VARCHAR(20) NOT NULL,
    Cname VARCHAR(20) NOT NULL,
    CEmail VARCHAR(30) NOT NULL,
    City VARCHAR(20) NOT NULL,
    Street VARCHAR(20) NOT NULL,
    Detail_Address VARCHAR(50),
UNIQUE(CUser_Id),
PRIMARY KEY(Ssn),
CONSTRAINT CHk_Email2 CHECK(
    REGEXP_LIKE(CEmail, '^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9._-]@[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]\\.[a-zA-Z]{2,4}$'))
);

CREATE TABLE SALE
(
    Sale_Id INT NOT NULL AUTO_INCREMENT,
    SSid INT NOT NULL,
    SVin VARCHAR(20) NOT NULL,
    SSsn INT,
    BookDate Date, -- Customer의 예약 날짜 (오기로 약속한 날짜)
UNIQUE(SVin),
PRIMARY KEY (Sale_Id),
FOREIGN KEY (SSid) REFERENCES SALESPERSON(Sid) ON UPDATE CASCADE,
FOREIGN KEY (SVin) REFERENCES VEHICLE(Vin) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY (SSsn) REFERENCES CUSTOMER(Ssn) ON UPDATE CASCADE
);
-- 판매 중 : SSsn이 NULL / 예약 완료 : SSsn이 NOT NULL / 판매 완료 : 데이터 삭제됨

CREATE TABLE USER
(
    Usn INT NOT NULL AUTO_INCREMENT,
    User_Id VARCHAR(20) NOT NULL,
    Password VARCHAR(20) NOT NULL,
    Role VARCHAR(20) NOT NULL,
UNIQUE(User_Id),
PRIMARY KEY (Usn),
CONSTRAINT Chk_Role CHECK (ROLE IN ("CUSTOMER", "ADMIN"))
);

ALTER TABLE SALESPERSON ADD FOREIGN KEY (SUser_Id) REFERENCES USER (User_Id) ON DELETE CASCADE;
ALTER TABLE CUSTOMER ADD FOREIGN KEY (CUser_Id) REFERENCES USER (User_Id) ON DELETE CASCADE;
ALTER TABLE VEHICLE_INFO ADD UNIQUE(Company, Model_Name, Engine_Capacity, Tonnage, Color, Year);

CREATE VIEW possible_booking_view(Model_Name, Company, Engine_Capacity, Tonnage, Color, Year, Vin, Price) 
      AS select Model_Name, 
                Company, 
                IFNULL(concat(Engine_Capacity,"cc"),"-") as Engine_Capacity, 
                IFNULL(concat(Tonnage,"톤"), "-")  as Tonnage, Color, concat(Year,"년") as Year, 
                Vin, 
                concat(Price,"만원") as Price 
            from sale, vehicle, vehicle_info 
            where SSsn IS NULL AND BookDate IS NULL AND Vin = SVin AND Vehicle_Info_Id = Info_Id AND Saled=FALSE;