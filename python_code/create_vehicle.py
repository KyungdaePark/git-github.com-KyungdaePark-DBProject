import random
import numpy as np


alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

base = "INSERT INTO Vehicle (Vin, Price, Saled, Vehicle_Info_Id) VALUES "

sql = []
for i in range(100000):
    Vin = ''
    Price = ''
    Vehicle_info_id = ''
    if i % 10000 == 0: print(i)
    randinfoid_idx = random.randint(1,50)
    randprice = random.randint(1,10) * 1000 
    Randvin_base = []
    for k in range(0,5):
        vin_idx = random.randint(0,len(alpha)-1)
        newvin_one = alpha[vin_idx]
        Randvin_base.append(newvin_one)
    Randvin_base.append(str(random.randint(10,99)))
    for k in range(0,4):
        vin_idx = random.randint(0,len(alpha)-1)
        newvin_one = alpha[vin_idx]
        Randvin_base.append(newvin_one)
    Randvin_base.append(str(random.randint(100000,999998)))
    for z in range(0,len(Randvin_base)):
        Vin += str(Randvin_base[z])
    Price = str(randprice)
    Vehicle_info_id = str(randinfoid_idx)

    query = base + '("' + Vin + '", "' + Price + '", "' + "0" + '", "' + Vehicle_info_id + '");\n'

    sql.append(query);

f = open('random_vehicle.sql', 'w')
for i, s in enumerate(sql):
    f.writelines(s)

f.close()