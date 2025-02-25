import { DataTypes } from "sequelize";
import sequelize from "../db.ConfigSequelize/connection.js";

const register = sequelize.define('register' , {
    id : { type : DataTypes.INTEGER , primaryKey : true , autoIncrement : true} ,
    rollNumber : { type : DataTypes.STRING , allowNull : false , unique: true} ,
    name : { type : DataTypes.STRING } ,
    email : { type : DataTypes.STRING , unique: true, allowNull : false},
    password : { type : DataTypes.STRING } ,
    isVerified : { type : DataTypes.ENUM('true' , 'false') , default : 'false' },
    role : {  type : DataTypes.ENUM( 'faculty','student'), default : 'student'},
} , { timestamps : false });

export default register;