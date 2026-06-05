const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Configuración de tu conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Gonzalez2015',
    database: `medellin_plan`
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('¡Conectado exitosamente a MySQL Workbench!');
});

app.post('/api/cliente', (req, res) => {
    // Estos nombres vienen de tu frontend (nombre, correo, telefono, plan)
    const { nombre, correo, telefono, plan } = req.body; 

    // Ajustamos la consulta para que coincida con tus columnas reales
    const sql = 'INSERT INTO cliente (nombre_completo, correo, telefono, plan) VALUES (?, ?, ?, ?)';
    
    // Pasamos los valores en el mismo orden que los pusimos en la línea de arriba
    db.query(sql, [nombre, correo, telefono, plan], (err, result) => {
        if (err) {
            console.error('Error al insertar en la BD:', err);
            return res.status(500).json({ mensaje: 'Error al guardar en la base de datos' });
        }
        res.status(200).json({ mensaje: '¡Cliente guardado con éxito!' });
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});