import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent implements OnInit, OnDestroy {
  private readonly router: Router = inject(Router);
  private readonly userDataService: UserDataService = inject(UserDataService);

  private onDestroy$ = new Subject<void>();

  disabledStep2: boolean = true;
  disabledStep3: boolean = true;

  ngOnInit(): void {
    this.moveToStep('1');
    this.getStepStatus();
  }

  moveToStep(stepNumber: string){
    this.router.navigate([`/step${stepNumber}`])
  }

  getStepStatus(){
    combineLatest([
      this.userDataService.getCarModel(), this.userDataService.getCarColor(),
      this.userDataService.getCarSpecs(),
    ])
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(([model,color,specs]) => {
      this.disabledStep2 = !model && !color;
      this.disabledStep3 = !specs;
    });
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
