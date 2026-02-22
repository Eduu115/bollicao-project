import express from "express";
import cors from "cors";
import { conectarDB } from "./db/conexion";
import clienteRoutes from "./routes/users";
import productoRoutes from "./routes/productos";
import compraRoutes from "./routes/compras";

const app = express();

// Permite peticiones desde el frontend (Angular en dev: 4200, producción: ajustar)
app.use(cors({
    origin: ["http://localhost:4200", "http://localhost:4000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());


app.get("/", (req, res) => {
    res.send("Bollicao API");
});

app.use("/api/clientes", clienteRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/compras", compraRoutes);

conectarDB().then(() => {
    app.listen(3000, () => {
        console.log("Servidor arrancado en http://localhost:3000");
    });
});
