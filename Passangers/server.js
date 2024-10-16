const express=require('express')
const mysql=require('mysql2')
require('dotenv').config()
const app=express()
const axios=require('axios')
app.use(express.json())

const connection=mysql.createConnection({
    host:'localhost',
    user:process.env.MYSQL_USERNAME,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
})


connection.connect((err)=>{
    if(err)
    console.log(err)
    
    console.log("connected to mysql database")

})



app.get("/getPassengers",async (req,res)=>{
 
    const flights=connection.query("Select * from  Passenger",(err,result,fields)=>{
        if(err)
            return res.status(500).json({message:"unable to load the passengers"})
        console.log(result)
        res.status(200).json(result)

    })
})


app.get("/getPassengers/:flightNumber",async (req,res)=>{
 
    const flights=connection.query("Select * from  Passenger where flight=(?)",[req.params.flightNumber],(err,result,fields)=>{
        if(err)
            return res.status(500).json({message:"unable to load the passengers"})
        console.log(result)
        res.status(200).json(result)

    })
})


app.post("/addPassengers",async (req,res)=>{

const bod=req.body
try{
    console.log(bod)
    const exists= await axios.get(`http://localhost:3002/getFlights/${bod.flight}`)
    console.log(exists.data)
if(exists)
{
    const {name,email,flight}=bod
    connection.query("insert into passenger(name,email,flight) values(?,?,?)",[name,email,flight],(err,result,fields)=>{
        if(err)
        {
            return res.status(400).json({message:"unable to add the passenger"})
        }
        console.log(result)
        res.status(201).json({message:"passenger added successfully"})


    })

}else{
    res.status(400).json({message:"flightNumber u specifies doesn't exists"})
}


}catch(err)
{ 
    res.status(400).json({message:"unable to find the flight"})

}



})
    


app.listen(process.env.PORT,()=>{
    console.log(`passenger App is listening on port ${process.env.PORT}`)
})