import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { CarColor, CarDataService, CarModel } from '../../services/car-data.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-model-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './model-step.component.html',
  styleUrl: './model-step.component.scss',
})

export class ModelStepComponent implements OnInit, OnDestroy {

  private readonly carDataService: CarDataService = inject(CarDataService);
  private readonly userDataService: UserDataService = inject(UserDataService);
  private formBuilder: FormBuilder = inject(FormBuilder);

  private readonly imgUrl: string = 'https://interstate21.com/tesla-app/images/';
  private onDestroy$ = new Subject<void>();

  allModels: CarModel[] = [];
  selectedCarColors: CarColor[] = [];
  selectedModel: string = '';
  selectedColor: string = '';
  modelForm: FormGroup = this.formBuilder.group({
    modelSelect: [''],
    colorSelect: ['']
  });

  ngOnInit(): void {
    this.getPreselectedData();
    this.getCarModels();
  }

  get carImage(){
    if( this.selectedColor && this.selectedModel ) {
      return `${this.imgUrl}${this.selectedModel}/${this.selectedColor}.jpg`
    } else {
      return '';
    }
  }

  getPreselectedData(){
    combineLatest([
      this.userDataService.getCarModel(), this.userDataService.getCarColor()
    ])
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(([carModel, carColor]) => {
      if(carColor && carModel) {
        this.selectedModel = carModel.code;
        this.selectedCarColors = structuredClone(carModel.colors);
        this.selectedColor = carColor.code;
      }
    });
  }

  getCarModels(){
    this.carDataService
    .getCarModelData()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((modelsData) => {
      this.allModels = structuredClone(modelsData);
    });
  }
  carModelChange(){
    this.selectedColor = '';
    const foundModel: CarModel | undefined = this.allModels.find(model => model.code === this.selectedModel);
    if(foundModel){
      this.selectedCarColors = foundModel.colors;
      this.userDataService.setCarModel(foundModel);
      this.selectedColor = this.selectedCarColors[0].code;
      this.userDataService.setCarColor(this.selectedCarColors[0]);
      this.userDataService.resetConfigs();
      this.carColorChange();
    }

  }
  carColorChange(){
    const foundColor: CarColor | undefined = this.selectedCarColors.find(color => color.code === this.selectedColor);
    if(foundColor){
      this.userDataService.setCarColor(foundColor);
    }

  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
 }
