import {Component, inject} from '@angular/core';
import {AsyncPipe, JsonPipe} from '@angular/common';
import { StepperComponent } from './components/stepper/stepper.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, StepperComponent, RouterModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  name = 'Angular';
  constructor(){
  }
}
