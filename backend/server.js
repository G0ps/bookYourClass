import express from "express"
import cors from "cors"

/* .env config */
import dotenv from 'dotenv'
dotenv.config({ path: './backend/.env' })

const app = express();

const port = process.env.APPLICATION_PORT

app.use(express.json())
app.use(cors({origin : true}))

app.get("/test" , (req , res)=>{
    return res.json({"RESPONSE" : "test run"})
})

app.listen(port , ()=>{
    console.log("application running on : " + `http://localhost:${port}`)
})