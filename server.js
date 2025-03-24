const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const {
  crearBaseDeDatos,
  crearColeccion,
  insertarDocumento
} = require('./mongoOperations');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/basedatos', (req, res) => {
  async function ejecutarOperaciones() {
    await crearBaseDeDatos(req.body.db);
    await crearColeccion(req.body.db, req.body.collectionName);
    await insertarDocumento(req.body.db, req.body.collectionName, { name: req.body.name, age: req.body.age });
  }
  console.log('DB:', req.body.db, '\nCollection name: ', req.body.collectionName, '\nName: ', req.body.name, '\nAge: ', req.body.age);
  res.send(req.body);
  ejecutarOperaciones().catch(console.error);
});

const {
  borrarDocumento
} = require('./mongoOperations');

app.post('/delete', (req, res) => {
  fetch('http://localhost:3000/delete', {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      db: req.body.db,
      collectionName: req.body.collectionName,
      name: req.body.name,
    }),
  }).then((response) => response.text())
    .then((result) => {
      console.log("Result: ", result);
      res.send(result);
    })
  });

app.delete('/delete', async (req) => {
  borrarDocumento(req.body.db, req.body.collectionName, { name: req.body.name });
  console.log("Delete: ", req.body.name)
});

const {
  actualizarDocumento
} = require('./mongoOperations');

app.post('/update', (req, res) => {
  fetch('http://localhost:3000/update', {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      db: req.body.db,
      collectionName: req.body.collectionName,
      name: req.body.name,
      age : req.body.age,
    }),
  }).then((response) => response.text())
    .then((result) => {
      console.log("Result: ", result);
      res.send(result);
    })
  });

app.patch('/update', async (req) => {
  actualizarDocumento(req.body.db, req.body.collectionName, { name: req.body.name }, { age: req.body.age });
  console.log("Update: ", req.body.collectionName)
});

const {
  verTodos
} = require('./mongoOperations');


app.get('/allinformation', async (req, res) => {
  const { db, collectionName } = req.query;
  const document = await verTodos(db, collectionName);
  console.log("Documento: ", document);
  res.status(200).json(document);
});



app.listen(3000);