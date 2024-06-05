import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { EmployeePosition } from '../../models/employeePosition.model';
import { AddPositionComponent } from '../add-position/add-position.component';
import { EditPositionComponent } from '../edit-position/edit-position.component';
import { PositionDetailsComponent } from '../position-details/position-details.component';
import { AuthService } from '../../services/auth-service.service';


@Component({
  selector: 'app-edit-employee',
  standalone: true,
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css',
  imports: [ReactiveFormsModule, RouterModule, EditPositionComponent, PositionDetailsComponent]
})
export class EditEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  employee: Employee = new Employee();
  employeePositions: EmployeePosition[] = [];

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private router: Router,
    public datePipe: DatePipe,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getEmployeeDetails(id);
    this.employeeForm = this.fb.group({
      identity: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(8)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      startOfWork: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      active: [true],
      employeePositions: this.fb.array([]),
    });
  }

  getEmployeeDetails(id: number): void {
    this.employeeService.getEmployeeByIdList(id).subscribe(
      (data: Employee) => {
        this.employee = data;
        this.populateForm();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  populateForm(): void {
    this.employeeForm.patchValue({
      identity: this.employee.identity,
      firstName: this.employee.firstName,
      lastName: this.employee.lastName,
      startOfWork: this.datePipe.transform(this.employee.startOfWork, 'yyyy-MM-dd'),
      birthDate: this.datePipe.transform(this.employee.birthDate, 'yyyy-MM-dd'),
      gender: this.employee.gender,
      active: this.employee.active,
    });

    const employeePositionsFormArray = this.employeeForm.get('employeePositions') as FormArray;
    employeePositionsFormArray.clear();

    this.employee.employeePositions.forEach((position) => {
      employeePositionsFormArray.push(this.fb.control(position));
      this.employeePositions.push(position);
    });
  }

  updatePosition(updatedPosition: EmployeePosition, index: number): void {
    const dialogRef = this.dialog.open(EditPositionComponent, {
      data: { employeePositions: this.employeePositions, position: updatedPosition, dateStart: this.employeeForm.get('startOfWork')?.value },
    });

    dialogRef.afterClosed().subscribe((result: EmployeePosition) => {
      if (result) {
        const employeePositionsFormArray = this.employeeForm.get('employeePositions') as FormArray;
        employeePositionsFormArray.at(index).patchValue(result);
        this.employeePositions[index] = result;
      } else {
        console.log('Dialog closed without data.');
      }
    });
  }

  deletePosition(index: number): void {
    const employeePositionsFormArray = this.employeeForm.get('employeePositions') as FormArray;
    employeePositionsFormArray.removeAt(index);
    this.employeePositions.splice(index, 1);
  }

  close(): void {
    this.router.navigate(['/employee/all']);
  }

  addPosition(): void {
    const dialogRef = this.dialog.open(AddPositionComponent, {
      data: { employeePositions: this.employeeForm.get('employeePositions')?.value, dateStart: this.employeeForm.get('startOfWork')?.value },
    });

    dialogRef.afterClosed().subscribe((result: EmployeePosition) => {
      if (result) {
        const employeePositionsArray = this.employeeForm.get('employeePositions') as FormArray;
        employeePositionsArray.push(this.fb.control(result));
        this.employeePositions.push(result);
      }
    });
  }

  updateEmployee(): void {
    if (this.employeeForm.valid) {
      const updatedEmployee: Employee = this.employeeForm.value;
      this.employeeService.updateEmployee(this.employee.id, updatedEmployee).subscribe(
        () => {
          this.router.navigate(['/employee/all']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}