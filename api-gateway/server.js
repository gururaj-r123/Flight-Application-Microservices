const express=require('express')
require('dotenv').config()

const {createProxyMiddleware}=require("http-proxy-middleware")

const app=express()

app.use('/airlines', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/flights',createProxyMiddleware({target:'http://localhost:3002',changeOrigin: true}))
app.use('/passengers',createProxyMiddleware({target:'http://localhost:3003',changeOrigin: true}))
app.listen(process.env.PORT,()=>{
    console.log(`gateway is listening on the port ${process.env.PORT}`)
})