const app = require('./src/app');
const { closeConnection } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log('Servidor iniciado en puerto ' + PORT);
    console.log('API: http://localhost:' + PORT);
});

process.stdin.resume();

process.on('SIGINT', async () => {
    await closeConnection();
    server.close(() => {
        process.exit(0);
    });
});

process.on('unhandledRejection', (err) => {
    console.error('Error:', err.message);
});

process.on('uncaughtException', (err) => {
    console.error('Error:', err.message);
});
