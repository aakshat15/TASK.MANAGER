import event from "../event.model.js";
import EventRegistration from "../eventRegistration.js";
import student from "../student.model.js";

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

EventRegistration.belongsTo(student, {
    foreignKey: "rollNumber",
    targetKey: "rollNumber",
    onDelete: "CASCADE",
});

student.hasMany(EventRegistration, {
    foreignKey: "rollNumber",
    sourceKey: "rollNumber",
    onDelete: "CASCADE",
});

export default { student , EventRegistration , event};