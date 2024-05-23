import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { CarConfigurations, CarDataService, CarSpecs } from '../../services/car-data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-specs-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './specs-step.component.html',
  styleUrl: './specs-step.component.scss',
})
export class SpecsStepComponent implements OnInit, OnDestroy {
  private readonly userDataService: UserDataService = inject(UserDataService);
  private readonly carDataService: CarDataService = inject(CarDataService);
  private formBuilder: FormBuilder = inject(FormBuilder);

  private readonly imgUrl = 'https://interstate21.com/tesla-app/images/';
  private onDestroy$ = new Subject<void>();


  carImage: string = '';
  carConfigs: CarSpecs[] = [];
  selectedConfig: CarSpecs | undefined = undefined;
  selectedConfigId: string | undefined = '';
  hasYoke: boolean = false;
  hasTow: boolean = false;
  selectedYoke: boolean = false;
  selectedTow: boolean = false;
  specsForm: FormGroup = this.formBuilder.group({
    configSelect: [''],
    includeYoke: [false],
    includeTow: [false],
  });

  ngOnInit(): void {
    this.getSpecsData();
  }

  getSpecsData(){
    combineLatest([
      this.userDataService.getCarModel(), this.userDataService.getCarColor(),
      this.userDataService.getCarSpecs(), this.userDataService.getCarTow(),
      this.userDataService.getCarYoke(),
    ]).pipe(takeUntil(this.onDestroy$))
    .subscribe(([model, color, specs, tow, yoke]) => {
      if(model && color){
        this.carImage =  `${this.imgUrl}${model.code}/${color.code}.jpg`;
      this.carDataService
      .getCarSpecsData(model?.code)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((carConfigs: CarConfigurations) => {
        this.carConfigs = structuredClone(carConfigs.configs);
        this.hasYoke = carConfigs.yoke;
        this.hasTow = carConfigs.towHitch
      });
    }
    if(specs?.id){
      this.selectedConfig = specs;
      this.selectedConfigId = specs.id.toString();
    }
    if(yoke){
      this.selectedYoke = yoke;
    }
    if(tow){
      this.selectedTow = tow;
    }
    });
  }
  configChange() {
    if(this.selectedConfigId){
      const id = parseInt(this.selectedConfigId);
      this.selectedConfig = this.carConfigs.find((option) => option.id === id);
    }
    if(this.selectedConfig){
      this.userDataService.setCarSpecs(this.selectedConfig);
    }
  }

  checkboxChange(checkbox: 'yoke' | 'tow'){
    if(checkbox === 'yoke'){
      this.userDataService.setCarYoke(this.selectedYoke);
    }else {
      this.userDataService.setCarTow(this.selectedTow);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
