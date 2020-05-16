import { Component, OnInit, Input, NgZone, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent implements OnInit, AfterViewInit {
  @Input() targetTime: Date;
  @Output() countdownComplete: EventEmitter<any> = new EventEmitter();
  currentTime: Date = new Date();
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  iterations: number;
  timerInterval;
  done: boolean;

  loaded: boolean = false;

  remainder: number = 0;
  quotient: number = 0;
  diffMilliSeconds: number;

  dialRotation: number = 180;
  dialRotationStr: string;

  dialStyle;
  secondsDialStyle;

  constructor(private ngZone: NgZone,
    private router: Router) {
    if (!this.targetTime)
      this.targetTime = new Date("20-Sep-2019 08:41 PM");
  }

  calculatePosition() {
    var self = this;
    this.ngZone.run(function () {
      console.group("checkTarget Started");
      self.currentTime = new Date();
      console.debug("Current Time " + self.currentTime);
      console.debug("Target Time " + self.targetTime);
      if (self.targetTime > self.currentTime) {
        self.diffMilliSeconds = (self.targetTime.getTime() - self.currentTime.getTime());
        self.quotient = self.diffMilliSeconds / (1 * 24 * 3600 * 1000);
        self.days = Math.floor(self.quotient);

        /* self.remainder in milliseconds */
        self.remainder = (self.quotient - self.days) * 24 * 3600 * 1000;
        console.debug(self.remainder);
        self.quotient = self.remainder / (3600 * 1000);
        self.hours = Math.floor(self.quotient);

        self.remainder = (self.quotient - self.hours) * 3600 * 1000;
        self.quotient = self.remainder / (60 * 1000);;
        self.minutes = Math.floor(self.quotient);

        self.remainder = (self.quotient - self.minutes) * 60 * 1000;
        self.seconds = Math.round(self.remainder / 1000);

        let dialBasis = 24 * 3600 * 1000;
        let secondsDialBasis = 60 * 1000;

        let remainingDeg = ((self.diffMilliSeconds / dialBasis) * 360);
        let secondsRemainingDeg = ((self.diffMilliSeconds / secondsDialBasis) * 360);

        self.iterations = self.days + 1;

        self.dialRotation = 360 - remainingDeg - 90;
        self.dialRotationStr = 'rotateZ(' + self.dialRotation + 'deg)';
        self.dialStyle = {
          transform: self.dialRotationStr
        };
        self.secondsDialStyle = {
          transform: 'rotateZ(' + Math.round((360 - secondsRemainingDeg - 90) % 360) + 'deg)'
        };

        console.debug(self.dialRotationStr + "; iterations pending = " + self.iterations);
      }

      console.groupEnd();
    });
  }

  checkCountdownComplete() {
    this.calculatePosition();

    if (this.currentTime.getTime() > this.targetTime.getTime()) {
      clearInterval(this.timerInterval);
      this.countdownComplete.emit(true);
      console.log("DONE !!!");
      this.done = true;
      // this.router.navigateByUrl('/home');
    }
  }
  ngOnInit() {
    this.done = false;
    var self = this;
    setTimeout(function () {
      self.ngZone.run(function () {
        self.loaded = true;
      });
    }, 500);


    self.checkCountdownComplete();
    this.timerInterval = setInterval(function () {
      self.checkCountdownComplete();
    }, 1000);

  }

  ngAfterViewInit() {

  }
}
