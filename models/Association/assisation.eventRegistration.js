import event from "../event.model.js";
import EventRegistration from "../eventRegistration.js";
import register from "../register.model.js";

EventRegistration.belongsTo(event, {
    foreignKey: "eventId",
    targetKey: "id",
    onDelete: "CASCADE",
});

event.hasMany(EventRegistration, {
    foreignKey: "eventId",
    sourceKey: "id",
    onDelete: "CASCADE",
});

EventRegistration.belongsTo(register, {
    foreignKey: "rollNumber",
    targetKey: "rollNumber",
    onDelete: "CASCADE",
});

register.hasMany(EventRegistration, {
    foreignKey: "rollNumber",
    sourceKey: "rollNumber",
    onDelete: "CASCADE",
});

export default { register , EventRegistration , event};