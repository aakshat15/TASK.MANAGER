import { DataTypes } from "sequelize";
import Sequelize from "../db.ConfigSequelize/connection.js";
import event from "./event.model.js";
import register from "./register.model.js";


const EventRegistration  = Sequelize.define(`revents`, {
                                    
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        studentName: { type: DataTypes.STRING, allowNull: false },
        studentEmail: { type: DataTypes.STRING, allowNull: false },
        eventId: { 
            type: DataTypes.INTEGER,  
            allowNull: false,  
            references: { model: event, key: "id" }  // Correct foreign key reference
        },
        rollNumber: {
            type : DataTypes.STRING,
            allowNull : false ,
            references: { model:register , key:'rollNumber'}
        }
    }, {
        timestamps: true
    });

export default EventRegistration;