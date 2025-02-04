import taskPriority from "../model/task_prority.model.js"
import task from "../model/task.model.js"



export const createTaskPage = async (request, response, next) => {

    try {
        let taskPriorities = await taskPriority.findAll();
        return response.render("createTask.ejs", { taskPriorities });
    }
    catch (err) {
        return response.render("error.ejs");
    }
}

export const createTask = async (request, response, next) => {
    try {
        let { title, description, priorityId } = request.body;
        let status = "Active";
        let date = new Date();
        date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        let taskStatus = await task.create({ title, description, priorityId, status, date })
        return response.redirect("/task/create-task");
    }
    catch (err) {
        return response.render("error.js");
    }
}

export const fetchTask = (request , response , next) => {
    task.findAll().then(result => {
        // console.log(result);
        return response.render("all_task.ejs" , {taskList: result});
    }).catch(err => {
        return response.render("error.js");
    })
}

export const fetchTaskById = ( request , response , next) => {
    let priorityId = request.params.priorityId;
    task.findByPriority(priorityId).then(result => {
        // console.log(result);
        return response.render("all_task.ejs" , {taskList: result});
    }).catch(err => {
        return response.render("error.js");
    })
}