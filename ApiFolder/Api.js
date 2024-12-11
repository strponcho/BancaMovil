const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const QRCode = require('qrcode');
const connect = require('./DB.js')

const app = express();
const port = 3000;

app.use(bodyParser.json());


app.post('/register', async (req, res) => {
  const { FirstName, LastName, Email, Password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);
    db = await connect()
    const query = 'INSERT INTO Users (FirstName, LastName, Email, Password) VALUES (?, ?, ?, ?)';

    db.query(query, [FirstName, LastName, Email, hashedPassword], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
      }
      res.status(200).json({ message: 'Usuario registrado correctamente' });
      console.log("Se registro el usuario")
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


app.post('/login', (req, res) => {
  const { Email, Password } = req.body;

  const query = 'SELECT * FROM Users WHERE Email = ?';
  db.query(query, [Email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al intentar iniciar sesión' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Correo no encontrado' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  });
});


app.post('/transactions', (req, res) => {
  const { SenderID, ReceiverID, Amount } = req.body;

  const query = 'INSERT INTO Transactions (SenderID, ReceiverID, Amount) VALUES (?, ?, ?)';
  db.query(query, [SenderID, ReceiverID, Amount], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al registrar la transacción' });
    }
    res.status(200).json({ message: 'Transacción registrada exitosamente' });
  });
});


app.get('/transactions/:userID', (req, res) => {
  const { userID } = req.params;

  const query = `
    SELECT * FROM Transactions 
    WHERE SenderID = ? OR ReceiverID = ?
  `;
  db.query(query, [userID, userID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener transacciones' });
    }
    res.status(200).json({ transactions: results });
  });
});


app.post('/generate-qr', async (req, res) => {
  const { Amount, SenderID, ReceiverID } = req.body;

  const transactionData = { Amount, SenderID, ReceiverID };
  const qrString = JSON.stringify(transactionData);

  try {
    const qrCode = await QRCode.toDataURL(qrString);
    res.status(200).json({ qrCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar el código QR' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

  

