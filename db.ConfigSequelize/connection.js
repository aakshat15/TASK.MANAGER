// Sequelize is a Node.js ORM (Object-Relational Mapper)

import { Sequelize } from "sequelize";
const sequelize = new Sequelize('upevent', 'root', 'akshat', {
    host: "localhost",
    dialect: "mysql" ,  // Fix: lowercase "dialect"
    logging: false,
}    
);


export default sequelize;