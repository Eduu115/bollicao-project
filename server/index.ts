import express from "express";
import userRoutes from "./routes/users";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/users", userRoutes);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
