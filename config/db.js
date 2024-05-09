const mongoose = require('mongoose');

require('dotenv').config({ path: '.env' });

const conectarDB = async () => {
    try{
        await mongoose.connect(process.env.DB_MONGO,
        //     {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useFindAndModify: false,
        //     useCreateIndex: true
        // }
    );
        console.log("Conectado a la base de datos");
    }catch (error){
        console.log("Hubo un error");
        console.log(error);
        process.exit(1); // Detener app
    }
}

module.exports = conectarDB;