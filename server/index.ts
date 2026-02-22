import express from "express";
import { conectarDB } from "./db/conexion";
import clienteRoutes from "./routes/users";
import productoRoutes from "./routes/productos";
import compraRoutes from "./routes/compras";

const app = express();

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
