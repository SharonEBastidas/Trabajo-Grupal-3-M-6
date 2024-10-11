import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import chalk from 'chalk';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

let users = [];

// Función para obtener un nuevo usuario desde la API Random User
const fetchRandomUser = async () => {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const userData = data.results[0];
        return {
            nombre: userData.name.first,
            apellido: userData.name.last,
            id: uuidv4(),
            timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
        };
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

// Ruta para registrar un nuevo usuario
app.get('/register', async (req, res) => {
    const newUser = await fetchRandomUser();
    users.push(newUser);
    res.send('Usuario registrado con éxito');
});

// Ruta para listar todos los usuarios registrados
app.get('/users', (req, res) => {
    // Imprimir la lista en consola con fondo blanco y texto azul usando Chalk
    console.log(chalk.bgWhite.blue(JSON.stringify(users, null, 2)));

    // Usar Lodash para recorrer el arreglo de usuarios y devolver la lista al cliente
    const userList = _.map(users, (user, index) => 
        `${index + 1}. Nombre: ${user.nombre} - Apellido: ${user.apellido} - ID: ${user.id} - Timestamp: ${user.timestamp}`
    );

    res.send(userList.join('<br>'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
