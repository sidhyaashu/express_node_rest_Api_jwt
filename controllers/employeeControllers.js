const data ={
    employees:require('../model/employees.json'),
    setEmployees:function(data){this.employees = data}
}


const getAllemployee=(req, res) => {
        res.json(data.employees);
}

const createNewEmployee=(req, res) => {
        const newEmployee={
            id:data.employees[data.employees.length -1].id +1 || 1,
            firstname:req.body.firstname,
            lastname:req.body.lastname
        }

        if(!newEmployee.firstname || !newEmployee.lastname){
            return res.status(400).json({"message":"First name and lastname require"})
        }
        data.setEmployees([...data.employees,newEmployee])
        res.status(202).json(data.employees)
}

const updateEmployee=(req, res) => {
        const employee = data.employees.find(emp =>emp.id === parseInt(req.body.id))
        if(!employee){
            return res.status(400).json({"message":`Employe ID ${req.body.id} not found`})
        }
        if(req.body.firstname) employee.firstname = req.body.firstname
        if(req.body.lastname) employee.lastname = req.body.lastname

        const filteredArray = data.employees.filter(emp=>emp.id==parseInt(req.body.id))
        const unSortedArray = [...filteredArray,employee]
        data.setEmployees(unSortedArray.sort((a,b)=>a.id>b.id?1:a.id<b.id?-1:0))
        res.status(200).json(data.employees)
}

const deleteEmployee=(req, res) => {
        const employee = data.employees.find(emp=>emp.id === parseInt(req.body.id))
        if(!employee){
            return res.status(400).json({"message":`employee id ${req.body.id} not found`})
        }

        const filteredArray = data.employees.filter(emp=>emp.id !== parseInt(req.body.id))
        data.setEmployees([...filteredArray])
        res.json(data.employees)
}

const getEmployee =(req, res) => {
        const employee = data.employees.find(emp=>emp.id === parseInt(req.params.id))
        if(!employee){
            return res.status(400).json({"message":`Employee Id ${req.params.id} not found`})
        }
        res.json(employee)
}


module.exports={
    getAllemployee,
    getEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee
}