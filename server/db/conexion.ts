import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bollicao';

export async function conectarDB(): Promise<void> {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`MongoDB conectado: ${MONGO_URI}`);
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        process.exit(1);
    }
}

// Eventos de conexión
mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
    console.error('Error de MongoDB:', err);
});
