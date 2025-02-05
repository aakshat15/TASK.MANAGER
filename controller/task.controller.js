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
        return response.render("error.ejs");
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
        return response.render("all_task.ejs" , {taskList: result});
    }).catch(err => {
        return response.render("error.js");
    })
}

export const fetchTaskEdit = async( request , response , next) => {
    let Prioritiestypes = await taskPriority.findAll();

    let prioritId = request.params.priorityId;    
    task.fatchPlaceHolderUpdate(prioritId).then(result => {
        // console.log(result[0].title);
        response.render("taskEdit.ejs",{ taskPriorities : Prioritiestypes , data : result});
    });
}

export const updateTaskDetalis = async( request , response , next) => {
    try{
        let priorityNumber = request.params.priorityId;
        
        let { title , description , priorityId } = request.body;
        // console.log(priorityNumber);
        // console.log(request.body);
        
        await task.updateTask({title , description , priorityId } , priorityNumber)
        // console.log("task was done");
        
        response.redirect("/task/all-task")
    }
    catch(err){
        return response.render("error.ejs");
    }
}

export const taskDelete = async(request , response , next) => {
    try{
        let priorityId = request.params.priorityId;
        console.log(priorityId);
        await task.deleteTask(priorityId)
        response.redirect("/task/all-task")
    }
    catch(err){
        return response.render("error.ejs")
    }
}