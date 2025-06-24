import express from "express";
import 'dotenv/config'
import appRoutes from "./routes/index.js"
import cors from "cors";
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api",appRoutes)
app.get("/",(req,res)=>{
res.send("Hello World")
})
app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`);

})