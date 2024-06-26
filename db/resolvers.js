const path = require('path');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: '.env'});



const crearToken = (usuario, secreta, expiresIn) => {

    const { id, email, nombre, apellido } = usuario;

    return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn });

}


//  Resolvers
const resolvers = {
    Query: {
        obtenerUsuario: async (_, { token }) => {
            const usuarioId = await jwt.verify(token, process.env.SECRETA);

            return usuarioId
        },
        obtenerProductos: async () => {
            try{
                const productos = await Producto.find({});
                return productos;
            } catch {
                console.log(error);
                throw new Error('Hubo un error');
            }
        },
        obtenerProducto: async (_, { id }) => {
            // Revisar si el producto existe
            const producto = await Producto.findById(id);

            if(!producto) {
                throw new Error('El producto no existe');
            }
            return producto;
        }
    },
    
    Mutation: {
        nuevoUsuario: async (_, { input }) => {
            const { email, password } = input;
            
            // REvisar si el usuario ya está registrado
            const existeUsuario = await Usuario.findOne({email});
            if (existeUsuario){
                throw new Error('El usuario ya está registrado');
            }
            
            // Hashear su password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);
            
            try{
                //Guardar en la base de datos
                const usuario = new Usuario(input);
                usuario.save();
                return usuario;

            }catch (error) {
                console.log(error);
                throw new Error('Hubo un error');
            }
        },
        autenticarUsuario: async (_, { input} ) => {

            const { email, password } = input;

            // Si el usuario existe
            const existeUsuario = await Usuario.findOne({ email });
            if (!existeUsuario) {
                throw new Error ('No existe el usuario')
            }

            // Revisar si el passwort es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if (!passwordCorrecto) {
                throw new Error ('Password incorrecto')
            }

            // Crear token
            return{
                token: crearToken(existeUsuario, process.env.SECRETA, '24h')
            }
        },
        nuevoProducto: async (_, { input }) => {
            try{
                const producto = new Producto(input);

                // almacenar en la bd
                const resultado = await producto.save();

                return resultado;
            } catch (error){
                // console.log(error);
                throw new Error('Error al guardar el producto');
            }
        },
        actualizarProducto: async (_, {id, input}) => {
            // Revisar si el producto existe
            let producto = await Producto.findById(id);

            if(!producto) {
                throw new Error('El producto no existe');
            }
            // Guardar en la bd
            producto = await Producto.findByIdAndUpdate({_id : id }, input, {new: true});
            return producto;
        },
        eliminarProducto: async (_, {id}) => {
            // Revisar si el producto existe
            let producto = await Producto.findById(id);

            if(!producto) {
                throw new Error('El producto no existe');
            }
            // Eliminar producto
            await Producto.findByIdAndDelete({_id : id });
            return 'Producto eliminado';
        }
    }
    
}

module.exports = resolvers;