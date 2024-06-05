import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { dateAfterOrEqualValidator } from '../../validators/dateAfterOrEqualValidator';
import { EmployeePosition } from '../../models/employeePosition.model';
import { Position } from '../../models/position.model';
import { PositionService } from '../../services/position.service';
import { duplicatePositionValidator } from '../../validators/duplicatePositionValidator ';
import { AddPositionComponent } from '../add-position/add-position.component';


@Component({
  selector: 'app-edit-position',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule],
  templateUrl: './edit-position.component.html',
  styleUrl: './edit-position.component.css'
})
export class EditPositionComponent implements OnInit {
  positionForm!: FormGroup;
  public positionList: Position[] = [];

  constructor(
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: { employeePositions: EmployeePosition[], position: EmployeePosition, dateStart: any },
    public dialogRef: MatDialogRef<AddPositionComponent>,
    private fb: FormBuilder,
    private _positinService: PositionService,
  ) {}

  ngOnInit(): void {
    this.positionForm = this.fb.group({
      positionId: ['', Validators.required],
      isAdministrative: ['', Validators.required],
      dateOfEntrance: ['', Validators.required, dateAfterOrEqualValidator(this.data.dateStart)],
    });

    this.loadPositions();
    this.populateForm();
  }

  loadPositions(): void {
    this._positinService.getPositionList().subscribe({
      next: (res) => {
        this.positionList = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  populateForm(): void {
    if (this.data.position && this.positionForm) {
      this.positionForm.patchValue({
        positionId: this.data.position.positionId || '',
        isAdministrative: this.data.position.isAdministrative || false,
        dateOfEntrance: this.datePipe.transform(this.data.position.dateOfEntrance, 'yyyy-MM-dd')
      });
    }
  }

  isDuplicate(indexPosition: number): boolean {
    return this.data.employeePositions.some(position => position.positionId === indexPosition);
  }

  updatePosition(): void {
    let position: EmployeePosition = this.positionForm.value;
    position.positionId = this.positionForm.get('positionId')?.value;
    position.isAdministrative = this.positionForm.get('isAdministrative')?.value === 'Yes';
    this.dialogRef.close(position);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}