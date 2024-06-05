import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { AuthService } from './auth-service.service';



@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private _http:HttpClient,private authService:AuthService) { }

  getEmployeeList():Observable<Employee[]>{
    return this._http.get<Employee[]>('http://localhost:5176/api/Employee')
  }

  getEmployeeByIdList(id: number):Observable<Employee>{
     return this._http.get<Employee>(`http://localhost:5176/api/Employee/${id}`)
  }

 
  updateEmployee(id:number,employee:Employee){
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.put<Employee>(`http://localhost:5176/api/Employee/${id}`,employee,{headers})

  }

  addEmployee(employee:Employee){
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.post<Employee>('http://localhost:5176/api/Employee/', employee, { headers });
  }


  deleteLogical(id:number){
    return this._http.put<Employee>(`http://localhost:5176/api/Employee/${id}/delete`,{})
  }
  
  deleteEmployee(id: number){
    return this._http.delete<Employee>(`http://localhost:5176/api/Employee/${id}`)

  }
}
