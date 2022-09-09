import {Request} from "./requests"; // önce export edilen sınıfı dahil edelim
import {UI} from "./ui";
// Elementlerin seçilmesi

const form = document.getElementById("employee-form");
const nameInput = document.getElementById("name");
const departmentInput = document.getElementById("department");
const salaryInput = document.getElementById("salary");
const employeesList = document.getElementById("employees");
const updateEmployeeButton = document.getElementById("update");

const request = new Request("http://localhost:3000/employees");
const ui = new UI();

let updateState = null;
eventListeners();

function eventListeners() {
    document.addEventListener("DOMContentLoaded",getAllEmployees);
    form.addEventListener("submit",addEmployee);
    employeesList.addEventListener("click",UpdateOrDelete);
    updateEmployeeButton.addEventListener("click",updateEmployee);
}
    
function getAllEmployees(){
    request.get()
    .then(employees =>{
        ui.addAllEmployeesToUI(employees);
    })
    .catch(err => console.log(err));

}
function addEmployee(e){

    const employeeName = nameInput.value.trim();
    const employeeDepartment = departmentInput.value.trim();
    const employeeSalary = salaryInput.value.trim();

    if(employeeName=== "" || employeeDepartment === ""||employeeSalary === ""){
        alert("Tüm alanlar dolu olmalı");
    }else{
        request.post({name:employeeName,department:employeeDepartment,salary:Number(employeeSalary)})
        .then(employee => {
            ui.addAllEmployeeToUI(employee);
        })
        .catch(err => console.log(err));
    }

    ui.clearInputs();
    e.preventDefault();
}
function UpdateOrDelete(e){
    if(e.target.id === "delete-employee"){
        deleteEmployee(e.target);
    }else if(e.target.id ==="update-employee"){
        updateEmployeeController(e.target.parentElement.parentElement);
        
    }
}
function deleteEmployee(target){
    const id = target.parentElement.previousElementSibling.previousElementSibling.textContent;
    request.delete(id)
    .then(message => {
        ui.deleteEmployeeFromUI(target.parentElement.parentElement);

    })
    .catch(err => console.log(err));
}

function updateEmployeeController(target){
    ui.toggleUpdateButton(target);

    if(updateState === null){
        updateState={
            updateId:target.children[3].textContent,
            updateParent:target
        }
    }else{
        updateState=null
    }
}
function updateEmployee(){
    if(updateState ){
        const data={name:nameInput.value.trim(),department:departmentInput.value.trim(),salary:Number(salaryInput.value.trim())};

        request.put(updateState.updateId,data)
        .then(updatedEmployee => {
            ui.updateEmployeeOnUI(updatedEmployee,updateState.updateParent);
            
        })
        .catch(err => console.log(err));
    }
}





// request.get()
// .then(employees => console.log(employees))
// .catch(err => console.log(err));

// request.post({name:"Pala Hüsnü",department:"Satış",salary:4000})
// .then(employee => console.log(employee))
// .catch(err => console.log(err));

// request.put(1,{name:"Şakir Üfler",department:"Satın Alma",salary:7000})
// .then(employee => console.log(employee))
// .catch(err => console.log(err));

// request.delete(5)
// .then(message => console.log(message))
// .catch(err => console.log(err));