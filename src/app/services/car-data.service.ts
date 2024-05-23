import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
  export class CarDataService {
    private readonly httpClient: HttpClient = inject(HttpClient);

  getCarModelData(): Observable<CarModel[]>{
    return this.httpClient.get<CarModel[]>('/models')
  }

  getCarSpecsData(model: string): Observable<CarConfigurations>{
    return this.httpClient.get<CarConfigurations>(`options/${model}`)
  }

}


export type CarModel = {
  code: string;
  description: string;
  colors: CarColor[];
}
export type CarColor = {
  code: string;
  description: string;
  price: number;
}
export type CarConfigurations = {
  configs: CarSpecs[];
  towHitch: false;
  yoke: boolean;
}
export type CarSpecs = {
  id: number,
  description: string;
  range: number,
  speed: number,
  price: number,
}
