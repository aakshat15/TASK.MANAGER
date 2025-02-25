import event from "../event.model.js";
import register from "../register.model.js";

// One faculty (Details) can create multiple events
register.hasMany(event, { foreignKey: "createdByfaculty" });

// Each event belongs to one faculty
event.belongsTo(register, { foreignKey: "createdByfaculty" });

export default { register, event }