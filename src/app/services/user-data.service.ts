import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarColor, CarConfigurations, CarModel, CarSpecs } from './car-data.service';

@Injectable({
  providedIn: 'root'
})
  export class UserDataService {
    private readonly userModelSelected$: BehaviorSubject<CarModel | null> =
    new BehaviorSubject<CarModel | null>(null);
  private readonly userColorSelected$: BehaviorSubject<CarColor | null> =
    new BehaviorSubject<CarColor | null>(null);
  private readonly userCarSpecs$: BehaviorSubject<CarSpecs | null> =
    new BehaviorSubject<CarSpecs | null>(null);
  private readonly userCarTow$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly userCarYoke$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  resetConfigs(){
      this.userCarSpecs$.next(null);
      this.userCarTow$.next(false);
      this.userCarYoke$.next(false);

    }

  setCarModel(userSelection: CarModel) {
    this.userModelSelected$.next(userSelection);
  }

  getCarModel(): Observable<CarModel | null> {
    return this.userModelSelected$.asObservable();
  }

  setCarColor(userSelection: CarColor) {
    this.userColorSelected$.next(userSelection);
  }

  getCarColor(): Observable<CarColor | null> {
    return this.userColorSelected$.asObservable();
  }

  setCarSpecs(userSelection: CarSpecs) {
    this.userCarSpecs$.next(userSelection);
  }

  getCarSpecs(): Observable<CarSpecs | null> {
    return this.userCarSpecs$.asObservable();
  }
  setCarYoke(userSelection: boolean) {
    this.userCarYoke$.next(userSelection);
  }

  getCarYoke(): Observable<boolean> {
    return this.userCarYoke$.asObservable();
  }

  setCarTow(userSelection: boolean) {
    this.userCarTow$.next(userSelection);
  }

  getCarTow(): Observable<boolean> {
    return this.userCarTow$.asObservable();
  }
}
