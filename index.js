const {ApolloServer} = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');


// Conectar a la base de datos y arrancar el servidor.
conectarDB()

//  servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    
    context: ( ) => {
        const miContext = "Hola";

        return{
            miContext
        }
    }
});


// Arrancar el servidor
server.listen().then(({ url }) => {
    console.log(` Server ready at ${url}`);
});
