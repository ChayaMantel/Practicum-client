import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Position } from '../models/position.model';


@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private _http:HttpClient) { }

  getPositionList():Observable<Position[]>{
    return this._http.get<Position[]>('http://localhost:5176/api/Position')
  }

  getPositionbyId(id: number):Observable<Position>{
     return this._http.get<Position>(`http://localhost:5176/api/Position/${id}`)
  }

  deletePosition(id: number){
    return this._http.delete<Position>(`http://localhost:5176/api/Position/${id}`)

  }

  updatePosition(id:Number,employee:Position){
    return this._http.put<Position>(`http://localhost:5176/api/Position/${id}`,employee)

  }

  addPosition(employee:Position){
    return this._http.post<Position>(`http://localhost:5176/api/Position/`,employee)

  }
}
