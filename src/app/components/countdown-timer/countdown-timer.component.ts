import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {interval, map, Subscription} from "rxjs";

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  imports: [],
  templateUrl: './countdown-timer.component.html',
  styleUrl: './countdown-timer.component.scss'
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  hours = signal<string>('00');
  minutes = signal<string>('00');
  seconds = signal<string>('00');
  private timerSubscription!: Subscription;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  startTimer() {
    this.timerSubscription = interval(1000).pipe(
      map(() => {
        const now = new Date();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const diff = endOfDay.getTime() - now.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return {
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0')
        };
      })
    ).subscribe(time => {
      this.hours.set(time.hours);
      this.minutes.set(time.minutes);
      this.seconds.set(time.seconds);
    });
  }
}
