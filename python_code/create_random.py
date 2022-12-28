import random
import numpy as np

base1 = "INSERT INTO USER (User_Id, Password, Role) VALUES "
base2 = "INSERT INTO CUSTOMER (CUser_Id, Cname, CEmail, City, Street, Detail_Address) VALUES "
base3 = "INSERT INTO SALESPERSON (SUser_Id, Sname, SEmail) VALUES "

first = '김이박정윤최장한오우배변곽공류홍표조주도신은혜선명진수국종경'

cities = ["SEOUL", "INCHEON", "LA", "NY", "BUSAN", "JEJU", "LONDON", "QATAR"]
mails = ["@naver.com", "@gmail.com", "@inha.edu"]
alpha = "abcdefghijklmnopqrstuvwxyz"
captial_alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
sql = []

for i in range(20000):
    User_Id = ''
    Password = ''
    SUser_Id = ''
    Sname = ''
    SEmail = ''
    Role = "ADMIN"
    if i%10000 == 0 : print(i)
    
    for k in range(0,8):
        User_Id += str(alpha[random.randint(0,len(alpha)-1)])
        Password += str(alpha[random.randint(0,len(alpha)-1)]) 
    
    for k in range(0,3):
        Sname += str(first[random.randint(0,len(first)-1)])
        
    SUser_Id = User_Id
    SEmail = SUser_Id + mails[random.randint(0,len(mails)-1)]
    
    query1 = base1+ '("' + User_Id + '", "' + Password + '", "' + Role + '");\n'
    query2 = base3 + '("' + SUser_Id + '", "' + Sname + '", "' + SEmail + '");\n'
    
    sql.append(query1)
    sql.append(query2)


for i in range(20000):
    User_Id = ''
    Password = ''
    CUser_Id = ''
    Cname = ''
    CEmail = ''
    City = ''
    Street = ''
    Detail_Address = ''
    Role = "CUSTOMER"
    if i%10000 == 0 : print(i)
    
    for k in range(0,8):
        User_Id += str(alpha[random.randint(0,len(alpha)-1)])
        Password += str(alpha[random.randint(0,len(alpha)-1)]) 
    CUser_Id = User_Id
    CEmail = User_Id +  mails[random.randint(0,len(mails)-1)]
    
    for k in range(0,3):
        Cname += str(first[random.randint(0,len(first)-1)])
        
    City += str(cities[random.randint(0,len(cities)-1)])
    
    for k in range(0,4):
        Street += str(captial_alpha[random.randint(0,len(captial_alpha)-1)])
        Detail_Address += str(random.randint(0,9));
        
    query1 = base1 + '("' + User_Id + '", "' + Password + '", "' + Role + '");\n'
    query2 = base2 + '("' + CUser_Id + '", "' + Cname + '", "' + CEmail + '", "' + City + '", "' + Street + '", "'+ Detail_Address + '");\n' 

    sql.append(query1)
    sql.append(query2)
    
f = open('random_infos.sql', 'w')
for i, s in enumerate(sql):
    f.writelines(s)

f.close()