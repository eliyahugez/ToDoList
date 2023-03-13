//********local storege*********// 

const setItemInLocalStorage = (key, value) => {
    return localStorage.setItem(key, value);
}

const getItemFromLocalStorage = (key) => {
    return localStorage.getItem(key);
}

const removeItemFromLocalStorage = (key) => {
    return localStorage.removeItem(key);
}


//*******Uniq ID**********// 
const generateUniqNumber = (array, key) => {
    const randomNumBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }    
    const random = randomNumBetween(1_000, 9_999);
    const item = array.find(item => item[key] === random);
    if (!item) return random;
    return generateUniqNumber(array, key);
}
//*******Task modole**********// 

class Tasks {
    title;
    taskInfo;
    date;
    status;
    id;

    constructor(task, tasksArray = []){
     const {title,taskInfo,date,status} = task
     
     this.status = status;
     this.date = date;
     this.taskInfo = taskInfo;
     this.title = title;
     this.id = generateUniqNumber(tasksArray,'id')
    }
}

//*******Dom Elements**********// 

const NEW_TITLE = document.querySelector('#newTaskTitle');
const NEW_DATE = document.querySelector('#newdate');
const NEW_TASK_INFO = document.querySelector('#newTaskInfo');
const NEW_ADD_BTN = document.querySelector('#addNewTaskBtn');
const TASKLIST = document.querySelector('#taskList');
const FILTER_BTN = document.querySelector('#Filter');
const ERROR_DIV = document.querySelector('#errorDiv');
const CLEAR_BTN = document.querySelector('#ClearAll');
const H3 = document.querySelector('#h3');
const SPANH3 = document.querySelector('#spanH3');
const SEARCH = document.querySelector('#searchTasks');
const SEARCH_SPAN= document.querySelector('#spanForSearch');



const addTaskToLocal = tasks => {
    try {
    let newTasksArray = [...tasks] ;
    const task = new Tasks ({
        title: NEW_TITLE.value,
        taskInfo: NEW_TASK_INFO.value,
        date: NEW_DATE.value,
        status: false,
       
    },newTasksArray)

    newTasksArray.push(task) ;

    setItemInLocalStorage('tasks', JSON.stringify(newTasksArray)); 


return newTasksArray;}
    catch (e) {
        console.log(e);
        return [];
    }
}

class TasksManeget {
    //*******Add new Task**********//
     renderTasks = (tasks) => {
    // let updateTasks = JSON.parse(getItemFromLocalStorage('tasks'));
    //*******Empty page**********// 
    TASKLIST.innerHTML = '';
    ERROR_DIV.style.display = 'none';
    //*******Creating div for each task with 2 btn**********// 
    tasks.reverse().forEach(task => {
         //*******Cotainer with ID**********// 
        const containerTask = document.createElement('div');
        containerTask.classList.add('task-container');
        containerTask.setAttribute('id',task.id)
         //*******Titel + Info + Task Number + Date + 2 BTN + Check Box**********// 
        const taskTitle = document.createElement('h6');
        taskTitle.classList.add('task-title');
        taskTitle.textContent = `${task.title}`;
        const taskInfo = document.createElement('div');
        taskInfo.classList.add('task-info');
        taskInfo.textContent = ` ${task.taskInfo}`;
        const taskID = document.createElement('div');
        taskID.classList.add('task-id');
        taskID.textContent = `Task Number : ${task.id}`;
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('task-date');

        const taskDate = new Date(task.date);
        const currentDate = new Date();

         if (taskDate.getTime() < currentDate.getTime()) {
             containerTask.style.backgroundColor = '#e3b5b5';
         dateSpan.textContent = ` Task date has passed : Date : ${taskDate.toISOString().slice(0, 10)} Time: ${taskDate.toISOString().slice(11, 16)}`;
         } else {
       
         dateSpan.textContent = `Task date has not passed yet - Date : ${taskDate.toISOString().slice(0, 10)} Time: ${taskDate.toISOString().slice(11, 16)}`;
         }

        const spanStatus = document.createElement('div');
        if (task.status == true) {
            spanStatus.textContent = `Completed`;
        } else if (task.status == false) {
            spanStatus.textContent = `Uncompleted`;
        }
        spanStatus.classList.add('spanStatus');
        spanStatus.setAttribute(`id`,`spanStatus${task.id}`)
        const removeBtn = document.createElement('input');
        removeBtn.classList.add('task-removeBtn');
        removeBtn.type = 'button';
        removeBtn.value = 'Remove';
        const doneBtn = document.createElement('input');
        doneBtn.classList.add('task-doneBtn');
        doneBtn.type = 'checkbox';
        doneBtn.value = 'Done';
        if (task.status == true) {
            doneBtn.setAttribute("checked", "");
        } else if (task.status == false) {
            doneBtn.removeAttribute("checked");
        }
        
        const EditBtn = document.createElement('input');
        EditBtn.classList.add('task-EditBtn');
        EditBtn.type = 'button';
        EditBtn.value = 'Edit';
      const hr = document.createElement('hr');
           //*******Append*********// 
        TASKLIST.appendChild(containerTask);
        containerTask.appendChild(taskID);
        containerTask.appendChild(dateSpan);
        containerTask.appendChild(spanStatus);
        containerTask.appendChild(hr);
        containerTask.appendChild(taskTitle);
        containerTask.appendChild(taskInfo);
        containerTask.appendChild(removeBtn);
        containerTask.appendChild(EditBtn);
        containerTask.appendChild(doneBtn);
        
      
       
    //*******Event for remove btn**********// 
        removeBtn.addEventListener('click', () =>{
        
            removeTask(task.id);
        })
         //*******Event for done btn**********// 
        doneBtn.addEventListener('click', (e) =>{
            doneTask(task.id,e);
       
        })
         //*******Event for edit btn**********// 
         EditBtn.addEventListener('click', (e) =>{
            const inputIDelement = document.getElementById(`inputContaiterEdit${task.id}`);
            if (inputIDelement == null)  editTask(task.id,e,tasks);
               
        })
       
    });
   
let updateTasksForRender = JSON.parse(getItemFromLocalStorage('tasks'));

//******* app for remove btn**********// 
const removeTask = (id ) => {
    const tasksManeget = new TasksManeget();
 const AfterRemuveTasksArray = [...updateTasksForRender] ;
 const taskObjectForRemove = AfterRemuveTasksArray.filter(task => task.id !== id);
 setItemInLocalStorage('tasks', JSON.stringify(taskObjectForRemove)); 
 tasksManeget.renderTasks(taskObjectForRemove)


}
//*******app for done btn**********// 
const doneTask = (id,e ) => {
 const AfterDoneTasksArray = [...updateTasksForRender] ;
 const taskObjectForDone = AfterDoneTasksArray.filter(task => task.id == id);
const stasutTask = taskObjectForDone[0].status
const spanId = document.getElementById(`spanStatus${id}`);

if (stasutTask == false) {
taskObjectForDone[0].status = true  
e.target.parentElement.style.backgroundColor = '#c5e3b5';
spanId.textContent = `Completed`
}
 else if (stasutTask == true){

    taskObjectForDone[0].status = false 
    spanId.textContent = `Uncompleted`
  
    const taskDate = new Date(taskObjectForDone[0].date);
    const currentDate = new Date();
    if (taskDate.getTime() < currentDate.getTime()) {
        e.target.parentElement.style.backgroundColor = '#e3b5b5';
    }
 }

 setItemInLocalStorage('tasks', JSON.stringify(AfterDoneTasksArray));
 tasksManeget.spanH3(AfterDoneTasksArray)

 return AfterDoneTasksArray

}




 //*******app for edit btn**********// 
const editTask = (id , e, updateTasksForRender) => {
    const tasksManeget = new TasksManeget();
    const AfterDoneTasksArray = [...updateTasksForRender] ;
    const taskObjectForDone = AfterDoneTasksArray.filter(task => task.id == id);
  
    const inputContaiterEdit = document.createElement('div');
    inputContaiterEdit.classList.add('inputContaiterEdit');
    inputContaiterEdit.setAttribute(`id`,`inputContaiterEdit${id}`)
    const inputTitle = document.createElement('input');
    inputTitle.classList.add('inputTitle');
    const inputTaskInfo = document.createElement('input');
    inputTaskInfo.classList.add('inputTaskInfo');
    const inputDate = document.createElement('input');
    inputDate.classList.add('inputDate');
    const inputBtn = document.createElement('input');
    const cencelBtn = document.createElement('input');
    inputBtn.classList.add('inputBtn');
    cencelBtn.classList.add('cencelBtn');
    inputTitle.type = 'text';
    inputTaskInfo.type = 'text';
    inputDate.type = 'datetime-local';
    inputBtn.type = 'button';
    cencelBtn.type = 'button';
    inputBtn.value = `Edit Task number ${id}`;
    cencelBtn.value = `Cencel`;
    inputTitle.setAttribute('placeholder','Title');
    inputTaskInfo.setAttribute('placeholder','Description');
    inputTitle.value = taskObjectForDone[0].title;
    inputTaskInfo.value = taskObjectForDone[0].taskInfo;
    const dateString = taskObjectForDone[0].date.toLocaleString("en-US", {timeZone: "Asia/Jerusalem"})
    const stringToDate = new Date(dateString);
    inputDate.value = stringToDate.toISOString().slice(0, 16);


    e.target.parentElement.appendChild(inputContaiterEdit);
    inputContaiterEdit.appendChild(inputTitle);
    inputContaiterEdit.appendChild(inputTaskInfo);
    inputContaiterEdit.appendChild(inputDate);
    inputContaiterEdit.appendChild(inputBtn);
    inputContaiterEdit.appendChild(cencelBtn);
  
    cencelBtn.addEventListener("click", ()=>{
        tasksManeget.renderTasks(AfterDoneTasksArray)
        inputContaiterEdit.remove();
    })



    inputBtn.addEventListener("click", ()=>{
if (inputTitle.value  !== '' && inputTaskInfo.value !== '' && inputDate.value !== '') {

    const tasksManeget = new TasksManeget();
    const AfterEditTasksArray = [...updateTasksForRender.reverse()] ;
    const taskObjectForEdit = AfterDoneTasksArray.filter(task => task.id == id);
    taskObjectForEdit[0].title = inputTitle.value;
    taskObjectForEdit[0].taskInfo = inputTaskInfo.value;
    taskObjectForEdit[0].date = inputDate.value;
    setItemInLocalStorage('tasks', JSON.stringify(AfterEditTasksArray));
    
    tasksManeget.renderTasks(AfterEditTasksArray)

    return AfterEditTasksArray;
} else {
    const errorDivForEdit = document.createElement('div');
    errorDivForEdit.classList.add('errorDivForEdit')
    errorDivForEdit.textContent = 'Please fill up all the fields';
    
    inputContaiterEdit.appendChild(errorDivForEdit);
}
inputContaiterEdit.remove();
       
    })
    }
    if (tasks.length == 0) {
        H3.textContent = ` you have no tasks`
    } else {
        
        H3.textContent = `You have ${tasks.length} tasks`
    }
    tasksManeget.spanH3(tasks)
}
//*******Event on Add btn**********// 
 eventForNewBtn = () => NEW_ADD_BTN.addEventListener("click", () => {
    const tasksManeget = new TasksManeget();
    if (NEW_TITLE.value  !== '' && NEW_DATE.value !== '' && NEW_TASK_INFO.value !== '' ) {
        let updateTasks = JSON.parse(getItemFromLocalStorage('tasks'));

        //*******Addnig the new tasks**********// 
           addTaskToLocal(updateTasks);
           const updatedTasks = addTaskToLocal(updateTasks);
           tasksManeget.renderTasks(updatedTasks);
          
            //*******All input empty**********// 
           const emptyField = () =>{
               NEW_TITLE.value=''
               NEW_DATE.value=''
               NEW_TASK_INFO.value=''
           }
          emptyField();
    } else {
        ERROR_DIV.style.display = 'block';
    }

    
  
})

eventForFilter = () => {
    FILTER_BTN.addEventListener("click",() =>{
        const tasksManeget = new TasksManeget();
        let updateTasks = JSON.parse(getItemFromLocalStorage('tasks'));
        const AfterFilterTasksArray = [...updateTasks] ;
        const taskObjectForFilter = AfterFilterTasksArray.filter(task => task.status == status);
        setItemInLocalStorage('tasks', JSON.stringify(taskObjectForFilter));
            tasksManeget.renderTasks(taskObjectForFilter);
         
    });
}

//********Fisrt Data*********// 
 firstData = () => {
    const tasksManeget = new TasksManeget();
    const data = {
        tasks: [
            {
                title: "Meeting at the bank",
                taskInfo: "Discount Petah Tikva - bring a bank statement + 3 months pay slips",
                date: "2023-03-26T18:12",
                status: false,
                id: "2342"
               
            },
            {
                title: "Real estate meeting",
                 taskInfo: "Ramat Gan, Nordau Street number 33, bring a contract + 2 guarantors",
                 date: "2023-01-26T18:12",
                 status: false,
             id: "3952"
               
            }
        ]
        
    }
    if(!getItemFromLocalStorage('tasks')) {
        setItemInLocalStorage('tasks', JSON.stringify(data.tasks));

    }
    tasksManeget.renderTasks(data.tasks)
    const tasksInLocalHost = JSON.parse(getItemFromLocalStorage('tasks')).map(task => new Tasks(task, data.tasks));


  return tasksInLocalHost;
  
    
}

   //*******Event on Add btn**********// 
   EventForClear = () => {
const  emptyArray  = {
    tasks: [
        
    ]
    
}
    
       CLEAR_BTN.addEventListener("click", ()=>{
        TASKLIST.innerHTML = '';
        setItemInLocalStorage('tasks', JSON.stringify(emptyArray.tasks) ); 
        SPANH3.textContent = '';
        SPANH3.textContent = `0 Are Not Completed , 0 Are Completed `;
        H3.textContent = ` you have no tasks`;
    })
    
    }

     //*******app for span h3 **********//
    spanH3 =(array) => {
    
        const statusTrue = array.filter(task => task.status == !status);
        const statusFalse = array.filter(task => task.status == status);
        const currentDate = new Date();
        let i = 0;
       const numberOflate =()=> statusFalse.forEach(task => {
            const taskDate = new Date(task.date);
          
         if (taskDate.getTime() < currentDate.getTime()) {
           return i++;
         }
       
        })
        numberOflate();
      
        SPANH3.textContent = '';
        SPANH3.textContent = `${statusFalse.length} Are Not Completed , ${statusTrue.length}  Are Completed  `;
    if (i !== 0) {
        SPANH3.textContent += `, And ${i} Already Late`;
    }

    } 
    
      //*******app for search **********//
     eventForSearch = (array) => {
    SEARCH.addEventListener("input",()=>{
        
        const tasksManeget = new TasksManeget();
        const ObjectForSearch = array.filter(task => task.title.toLowerCase().includes(SEARCH.value.toLowerCase()));
        if (ObjectForSearch.length >= 1) {
            SEARCH_SPAN.textContent = "";
            tasksManeget.renderTasks(ObjectForSearch)
        }  else if (SEARCH.value === '') {
            SEARCH_SPAN.textContent = "";
            tasksManeget.renderTasks(array)
        } else if (ObjectForSearch.length < 1){
SEARCH_SPAN.textContent = "There is NO Task with this Title";
        }
      
    })
}

   }
 

const tasksManeget = new TasksManeget();
updateTasks = JSON.parse(getItemFromLocalStorage('tasks'));
if (!updateTasks) {
    tasksManeget.firstData(); 
  
} else {
    tasksManeget.renderTasks(updateTasks);  
  
}

tasksManeget.eventForNewBtn();
tasksManeget.eventForFilter();
tasksManeget.EventForClear();
tasksManeget.eventForSearch(updateTasks);









