import mysql from 'mysql';

export const db = mysql.createConnection({
    host:"sql6.freesqldatabase.com",
    user:'sql6587120',
    password:'Gwh5QVbHm5',
    database:"sql6587120",

    connectionLimit : 100,
        waitForConnections : true,
        queueLimit :0,
        debug    :  true,
        wait_timeout : 28800,
        connect_timeout :10
})