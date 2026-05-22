import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

/* .env config */
import dotenv from 'dotenv'
dotenv.config({ path: './backend/.env' })

/* routes configuration */
import mainRouter from "./routes/mainRouter.js"

/* Database Connectivity */
import connectDatabases from "./repositories/connectDatabases.js"

const app = express();

const port = process.env.APPLICATION_PORT

app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser()); // for cookies handling

app.use(mainRouter);

connectDatabases();

app.get("/test" , (req , res)=>{
    return res.json({"RESPONSE" : "test run"})
})

app.listen(port , ()=>{
    console.log("application running on : " + `http://localhost:${port}`)
})