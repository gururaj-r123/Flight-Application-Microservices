const express=require('express')
const mysql=require('mysql2')
const axios=require('axios')
require('dotenv').config()
const app=express()

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


app.get("/getFlights",async (req,res)=>{
 
        const flights=connection.query("Select * from  Flight",(err,result,fields)=>{
            if(err)
                return res.status(500).json({message:"unable to load the flights"})
            console.log(result)
            res.status(200).json(result)

        })
    })


app.post("/addFlights",async (req,res)=>{

    const company=req.body
    try{
        console.log(company)
        const exists= await axios.get(`http://localhost:3001/getAirlines/${company.flightCompany}`)
        console.log(exists.data)
    if(exists)
    {
        const {flightNumber,flightCompany}=company
        connection.query("insert into Flight(flightNumber,flightCompany) values(?,?)",[flightNumber,flightCompany],(err,result,fields)=>{
            if(err)
            {
                return res.status(400).json({message:"unable to ad the flight"})
            }
            console.log(result)
            res.status(201).json({message:"flight added successfully"})


        })

    }else{
        res.status(400).json({message:"company u specifies doesn't exists"})
    }
    

    }catch(err)
    { 
        res.status(400).json({message:"unable to find the company"})
 
    }
    


})


app.get("/getFlightsAndPassengers/:flightNumber",async (req,res)=>{
    var flightdetails=null
   
    
    connection.query(`Select * from  Flight where flightNumber=(?)`,[req.params.flightNumber],(err,result,fields)=>{
        if(err)
            return res.status(500).json({message:"unable to load the flight"})
        
        console.log(result)
        flightdetails=result
         

    })
    const passengerslist=await axios.get(`http://localhost:3003/getPassengers/${req.params.flightNumber}`)
    //response.passengers=passengers;
    const passengers=passengerslist.data
    res.status(200).json({flightDetails:flightdetails[0],passengers:passengers});

})



app.get("/getFlights/:company",async (req,res)=>{
    var flightdetails=null
   
    
    connection.query(`Select * from  Flight where flightCompany=(?)`,[req.params.company],(err,result,fields)=>{
        if(err)
            return res.status(500).json({message:"unable to load the flight"})
        
        console.log(result)
        res.status(200).send(result)
         

    })
    

})
        
  

   
 
    




// app.get("/getFlightsByCompany/:company",(req,res)=>{

// })




app.listen(process.env.PORT,()=>{
    console.log(`Flight App is listening on port ${process.env.PORT}`)
})