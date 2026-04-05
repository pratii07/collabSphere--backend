require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/authRoutes"); 
const projectRoutes = require("./routes/projectRoutes")
const aiRoutes = require("./routes/aiRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors()); 

connectDB();

app.use("/user", userRoutes); 
app.use("/project", projectRoutes); 
app.use("/ai", aiRoutes);
app.use("/api/gemini", geminiRoutes);



app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});