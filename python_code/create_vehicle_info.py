import random
import numpy as np

companys = ["KIA", "HYUNDAI", "FORD", "TOYOTA", "VOLKSWAGENGROUP", "NISSAN", "BMW", "MERCEDES-BENZ"]
ModelName = ''
ModelAlpha = ["S", "K", "A", "H", "Z", "E", "C","B"]
ModelNumber = ["100", "200", "300", "400", "500", "404", "707"]
Colors = ["BLACK", "WHITE", "GREY", "BLUE", "RED", "GREEN", "YELLOW"]
base = "INSERT INTO Vehicle_Info (Company, Model_Name, Engine_Capacity, Tonnage, Color, Year) VALUES "

company_idx = random.randint(0,len(companys)-1)
alpha_idx = random.randint(0,len(ModelAlpha)-1)
number_idx = random.randint(0,len(ModelNumber)-1)
color_idx = random.randint(0,len(Colors)-1)
randcapcity = random.randint(1500,2299)
randton = random.randint(1,20)
randyear = random.randint(2010,2021)
sql = []
for i in range(50):
    Company=''
    Model_Name=''
    Engine_Capacity=''
    Tonnage = ''
    Color = ''
    Year = ''
    company_idx = random.randint(0,len(companys)-1)
    number_idx = random.randint(0,len(ModelNumber)-1)
    color_idx = random.randint(0,len(Colors)-1)
    randcapcity = random.randint(1500,2299)
    randton = random.randint(1,20)
    randyear = random.randint(2010,2021)
    Company = companys[company_idx]
    
    Modelname_base = []
    for k in range(0,3):
        alpha_idx = random.randint(0,len(ModelAlpha)-1)
        newalpha = ModelAlpha[alpha_idx]
        Modelname_base.append(newalpha)
    
    Model_Name = Modelname_base[0] + Modelname_base[1] + Modelname_base[2]+ '-' + ModelNumber[number_idx]
    Engine_Capacity = randcapcity
    Tonnage = randton
    Color = Colors[color_idx]
    Year = randyear

    query = base + '("' + Company + '", "' + Model_Name + '", "' + str(Engine_Capacity) + '", "' + str(Tonnage) + '", "' + Color + '","' + str(Year) + '");\n'

    sql.append(query);

f = open('random_vehicle_info.sql', 'w')
for i, s in enumerate(sql):
    f.writelines(s)

f.close()