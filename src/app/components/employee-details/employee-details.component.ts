import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'tr[app-employee-details]',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent {
  @Input() employee!: Employee;
  constructor(private router: Router, private employeeService: EmployeeService) {

  }
  onEditClick(employee: Employee) {

    this.router.navigate(['/employee/edit', employee.id])
  }
  onDeleteClick(employee: Employee) {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteLogical(employee.id).subscribe(
          () => {
            Swal.fire({
              title: "deleted!",
              text: "The employee deleted successfully",
              icon: "success"
            });
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });

  }
}
