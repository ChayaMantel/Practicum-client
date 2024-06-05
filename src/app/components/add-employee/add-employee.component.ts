import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../services/employee.service';
import { PositionDetailsComponent } from '../position-details/position-details.component';
import { EmployeePosition } from '../../models/employeePosition.model';
import { Employee } from '../../models/employee.model';
import { AddPositionComponent } from '../add-position/add-position.component';


@Component({
  selector: 'app-add-employee',
  standalone: true,
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
  imports: [ReactiveFormsModule, MatButtonModule, PositionDetailsComponent]
})

export class AddEmployeeComponent implements OnInit {
  public employeeForm!: FormGroup;
  public employeePositions: EmployeePosition[] = [];

  constructor(private _employeeService: EmployeeService, private fb: FormBuilder, private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    const nameFormatRegex: RegExp = /^[A-Za-z]+$/;

    this.employeeForm = this.fb.group({
      identity: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(8)]],
      firstName: ['', [Validators.required, Validators.pattern(nameFormatRegex)]],
      lastName: ['', [Validators.required, Validators.pattern(nameFormatRegex)]],
      startOfWork: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      active: [true],
      employeePositions: this.fb.array([])
    });

  }
  addPosition(): void {
    const dialogRef = this.dialog.open(AddPositionComponent, {
      data: { employeePositions: this.employeePositions, dateStart: this.employeeForm.get('startOfWork')?.value }
    });

    dialogRef.afterClosed().subscribe((result: EmployeePosition) => {
      if (result) {
        const employeePositionsArray = this.employeeForm.get('employeePositions') as FormArray;
        employeePositionsArray.push(this.fb.control(result));
        this.employeePositions.push(result);

      } else {
        console.log('Dialog closed without data.');
      }
    });
  }

  closeAdd() {
    this.router.navigate(['/employee/all'])
  }

  save() {
    let employee: Employee = this.employeeForm.value;
    employee.gender = (this.employeeForm.get('gender')?.value).id === 'male' ? 0 : 1;

    this._employeeService.addEmployee(employee).subscribe({
      next: (response) => {
        Swal.fire({
          title: "Add!",
          text: "The personal details added successfully",
          icon: "success"
        });
        this.router.navigate(['/employee/all'])

      },
      error: (error) => {
        console.log(error)
      }
    });
  }
}








