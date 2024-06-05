import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateAfterOrEqualValidator } from '../../validators/dateAfterOrEqualValidator';
import { PositionService } from '../../services/position.service';
import { EmployeePosition } from '../../models/employeePosition.model';
import { Position } from '../../models/position.model';
import { duplicatePositionValidator } from '../../validators/duplicatePositionValidator ';

@Component({
  selector: 'app-add-position',
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule],
  templateUrl: './add-position.component.html',
  styleUrl: './add-position.component.css'
})
export class AddPositionComponent implements OnInit {
  public positionForm!: FormGroup;
  public positionList: Position[] = [];

  constructor(
    private _positinService: PositionService, private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPositionComponent>, @Inject(MAT_DIALOG_DATA) public data: { employeePositions: EmployeePosition[], dateStart: any }) { }

  ngOnInit(): void {
    this.loadPositions();
    this.positionForm = this.fb.group({
      positionId: ['', Validators.required, duplicatePositionValidator(this.data.employeePositions)],
      isAdministrative: ['', Validators.required],
      dateOfEntrance: ['', Validators.required, dateAfterOrEqualValidator(this.data?.dateStart)],
    })
  }

  loadPositions() {
    this._positinService.getPositionList().subscribe({
      next: (res) => {
        this.positionList = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  isDuplicate(index: number) {
    const isDuplicate = this.data.employeePositions.some(
      position => position.positionId == index
    );
    return (isDuplicate ? true : false);
  }

  savePosition() {
    let position: EmployeePosition = this.positionForm.value;
    position.isAdministrative = this.positionForm.get('isAdministrative')?.value === 'Yes' ? true : false;
    this.dialogRef.close(position);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
