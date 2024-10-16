const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()

const axios=require('axios')

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("connected to the mongdb")).catch((err)=>{
    console.log("mongodb error :",err)
})


const companySchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    headquarters:{
        type:String,
        required:true
    }
})

const Airlines=mongoose.model("Airlines",companySchema)





const app=express()

app.use(express.json())


app.post('/addAirlines',async (req,res)=>{
    try{
    //     const airlines=new Airlines(req.body)
    // const response=await airlines.save()

    const response=await Airlines.create(req.body)

    res.status(201).json(response)

    }catch(err)
    {
        console.log(err)
        res.status(500).json({'message':"unable to save"})
    }
    

})


app.get("/getAirlines",async (req,res)=>{
    try{
        const airlines=await Airlines.find()
        res.status(200).json(airlines)

    }catch(err)
    {
        console.log(err.message)
        res.status(500).json({'message':"unable to get "})
        
    }

})


app.get("/getAirlines/:name",async (req,res)=>{
    try{
        const response= await Airlines.findOne({name:req.params.name})
        const flights=await axios.get(`http://localhost:3002/getFlights/${req.params.name}`)
        res.status(200).json({response,flights:flights.data})

    }catch(err)
    {
        console.log(err.message)
        res.status(500).json({'message':`airlines with then name ${req.params.name} not exists`})
    }
})




app.listen(process.env.PORT,()=>{
    console.log(`App is listening on the port:${process.env.PORT}`)
})


