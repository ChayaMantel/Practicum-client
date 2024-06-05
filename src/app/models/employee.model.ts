import { EmployeePosition } from "./employeePosition.model"

export class Employee{
    id!:number
    identity!:string
    firstName!:string
    lastName!:string
    startOfWork!:Date
    birthDate!:Date
    gender!:number
    active!: boolean
    employeePositions!: EmployeePosition[];
}