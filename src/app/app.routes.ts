import { Routes } from '@angular/router';
import { ModelStepComponent } from './components/model-step/model-step.component';
import { SpecsStepComponent } from './components/specs-step/specs-step.component';
import { SummaryStepComponent } from './components/summary-step/summary-step.component';
export const routes: Routes = [
    { path: 'step1', component: ModelStepComponent },
    { path: 'step2', component: SpecsStepComponent },
    { path: 'step3', component: SummaryStepComponent },
    { path: '', redirectTo: '/step1', pathMatch: 'full', } ,
];
