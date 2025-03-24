const { MongoClient } = require('mongodb');

const url = "mongodb://127.0.0.1:27017/";

async function connectToMongo() {
    const client = new MongoClient(url);
    await client.connect();
    return client;
}

//Creacion de una BD 
async function crearBaseDeDatos(mydb) {
    const client = await connectToMongo();
    const db = client.db(mydb);
    console.log(`Base de datos '${mydb}' creada o conectada.`);
    await client.close();
}

//Creacion de una coleccion dentro de una BD
async function crearColeccion(mydb, coleccion) {
    const client = await connectToMongo();
    const db = client.db(mydb);
    await db.createCollection(coleccion);
    console.log(`Colección '${coleccion}' creada.`);
    await client.close();
}


//Insertar dentro de una coleccion de una BD
async function insertarDocumento(mydb, coleccion, documento) {
    const client = await connectToMongo();
    const db = client.db(mydb);
    const collection = db.collection(coleccion);
    const resultado = await collection.insertOne(documento);
    console.log(`Documento insertado con ID: ${resultado.insertedId}`);
    await client.close();
}


// Obtener datos del primer elemento dentro de una colección
async function obtenerPrimerElemento(coleccion) {
    const client = await connectToMongo();
    try {
        const db = client.db(mydb);
        const collection = db.collection(coleccion);
        const result = await collection.findOne({});
        console.log(result.nombre);
        return result;
    } finally {
        await client.close();
    }
}

// Ver todos los elementos
async function verTodos(mydb, coleccion) {
    const client = await connectToMongo();
    try {
        const db = client.db(mydb);
        const collection = db.collection(coleccion);
        const result = await collection.find({}).toArray();
        console.log(result);
        return result;
    } finally {
        await client.close();
    }
}

// Query simple
async function querySimple(coleccion, query) {
    const client = await connectToMongo();
    try {
        const db = client.db(mydb);
        const collection = db.collection(coleccion);
        const result = await collection.find(query).toArray();
        console.log(result);
        return result;
    } finally {
        await client.close();
    }
}

// Sort por un criterio (campo)
async function sortPorCampo(coleccion, campo, orden = 1) {
    const client = await connectToMongo();
    try {
        const db = client.db(mydb);
        const collection = db.collection(coleccion);
        const result = await collection.find().sort({ [campo]: orden }).toArray();
        console.log(result);
        return result;
    } finally {
        await client.close();
    }
}


//Borrar  
async function borrarDocumento(mydb, coleccion, filtro) {
    const client = await connectToMongo();
    const db = client.db(mydb);
    const collection = db.collection(coleccion);
    const resultado = await collection.deleteOne(filtro);
    console.log(`${resultado.deletedCount} documento(s) borrado(s).`);
    await client.close();
}


//Actualizar
async function actualizarDocumento(mydb, coleccion, filtro, actualizacion) {
    const client = await connectToMongo();
    const db = client.db(mydb);
    const collection = db.collection(coleccion);
    const resultado = await collection.updateOne(filtro, { $set: actualizacion });
    console.log(`${resultado.modifiedCount} documento(s) actualizado(s).`);
    await client.close();
}


module.exports = {
    crearBaseDeDatos,
    crearColeccion,
    insertarDocumento,
    obtenerPrimerElemento,
    verTodos,
    querySimple,
    sortPorCampo,
    borrarDocumento,
    actualizarDocumento
};

