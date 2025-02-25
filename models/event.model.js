import { DataTypes } from "sequelize";
import sequelize from "../db.ConfigSequelize/connection.js";
import register from "./register.model.js";


const event = sequelize.define('event', {

    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    endDate: { type: DataTypes.STRING, allowNull: false },
    // Foreign Key: Reference 'id' from 'details' table
    createdByfaculty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: register,
            key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
} , { timestamps : true});

export default event;