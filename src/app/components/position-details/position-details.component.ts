import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { EmployeePosition } from '../../models/employeePosition.model';
import { Position } from '../../models/position.model';
import { PositionService } from '../../services/position.service';


@Component({
  selector: 'app-position-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './position-details.component.html',
  styleUrl: './position-details.component.css'
})
export class PositionDetailsComponent implements OnInit {
  positionList: Position[] = [];
  @Input()
  position!: EmployeePosition;

  constructor(private positionService: PositionService) { }

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.positionService.getPositionList().subscribe({
      next: (res: Position[]) => {
        this.positionList = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getPositionName(): string {
    const foundPosition = this.positionList.find((p) => p.id == this.position.positionId);
    return foundPosition ? foundPosition.name : 'Position not found';
  }
}