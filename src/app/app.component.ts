import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'countdown-timer';
  launchDate: Date = new Date("16-May-2020 16:00 GMT+0530");
  countdownComplete: boolean = false;
}
