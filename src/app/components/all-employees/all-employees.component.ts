import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDetailsComponent } from "../employee-details/employee-details.component";
import { AuthService } from '../../services/auth-service.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-all-employees',
  standalone: true,
  templateUrl: './all-employees.component.html',
  styleUrl: './all-employees.component.css',
  imports: [RouterModule, DatePipe, ReactiveFormsModule, EmployeeDetailsComponent]
})
export class AllEmployeesComponent implements OnInit {
  filterForm!: FormGroup;
  employeeList: Employee[] = [];
  currentUser: any;

  constructor(private _employeeService: EmployeeService, private router: Router, private datePipe: DatePipe,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadEmployees();
    this.filterForm = this.fb.group({
      filter: ['']
    });

    this.currentUser = sessionStorage.getItem('name');
  }

  loadEmployees(): void {
    this._employeeService.getEmployeeList().subscribe({
      next: (res) => {
        this.employeeList = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addNewClick(): void {
    this.router.navigate(['/employee/add']);
  }

  onEditClick(employee: Employee): void {
    this.router.navigate(['/employee/edit', employee.id]);
  }

  filteredEmployees(): Employee[] {
    const filterValue = (this.filterForm.get('filter')?.value || '').toLowerCase();
    return this.employeeList.filter(employee =>
      employee.firstName.toLowerCase().includes(filterValue) ||
      employee.lastName.toLowerCase().includes(filterValue) ||
      employee.identity.toLowerCase().includes(filterValue) ||
      (this.datePipe.transform(employee.startOfWork, 'yyyy-MM-dd') || '').includes(filterValue)
    );
  }

  exportToExcel(): void {
    const activeEmployees = this.employeeList.filter(emp => emp.active);
    const data = activeEmployees.map(emp => ({
      firstName: emp.firstName,
      lastName: emp.lastName,
      identity: emp.identity,
      startOfWork: this.datePipe.transform(emp.startOfWork, 'yyyy-MM-dd') || ''
    }));
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, 'employee_list.xlsx');
  }
}