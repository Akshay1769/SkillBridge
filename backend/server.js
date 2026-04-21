require("dotenv").config();
const express = require("express")
const app = express();

app.use(express.json());

app.use(cors({
  origin: "*" //origin: "https://.vercel.app"
}));

const userRoutes = require("./routes/userroutes");

app.use("/api/users" , userRoutes);

app.get("/" , (req , res) => {
    res.send("backend working");

});

const PORT = 5000;

app.listen(PORT , () => {
    console.log(`server running on port ${PORT}`);
});