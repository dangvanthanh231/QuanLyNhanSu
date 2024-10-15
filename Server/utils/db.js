import mysql from 'mysql'

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3307,
    password:"",
    database:"employeem"
})

con.connect(function(err){
    if(err){
        console.log("Connection error")
    }else{
        console.log("Connected")
    }
})

export default con;