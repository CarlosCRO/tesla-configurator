import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { CarColor, CarModel, CarSpecs } from '../../services/car-data.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';

@Component({
  selector: 'app-summary-step',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './summary-step.component.html',
  styleUrl: './summary-step.component.scss',
})
export class SummaryStepComponent implements OnInit {
  private readonly userDataService: UserDataService = inject(UserDataService);

  private readonly imgUrl = 'https://interstate21.com/tesla-app/images/';
  private onDestroy$ = new Subject<void>();
  readonly towYokeCost = 1000;

  carImage: string = '';
  summaryModel?: CarModel;
  summaryColor?: CarColor;
  summarySpecs?: CarSpecs;
  hasYoke?: boolean;
  hasTow?: boolean;
  total: number = 0;

  ngOnInit(): void {
    this.getSummaryData();
  }
  getSummaryData(){
    combineLatest([
      this.userDataService.getCarModel(), this.userDataService.getCarColor(),
      this.userDataService.getCarSpecs(), this.userDataService.getCarTow(),
      this.userDataService.getCarYoke(),
    ]).pipe(takeUntil(this.onDestroy$))
    .subscribe(([model, color, specs, tow, yoke]) => {
      if(model && color){
        this.carImage = `${this.imgUrl}${model.code}/${color.code}.jpg`;
        this.summaryColor = color;
        this.summaryModel = model;
      }
      if(specs){
        this.summarySpecs = specs;
      }
      this.hasTow = tow;
      this.hasYoke = yoke;
      this.totalCost();
    });
  }

  totalCost(){
    if(this.summaryColor && this.summarySpecs){
      this.total = this.summaryColor.price + this.summarySpecs.price;
    }
    if(this.hasTow) {
      this.total += this.towYokeCost;
    }
    if(this.hasYoke){
      this.total += this.towYokeCost;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

 }
