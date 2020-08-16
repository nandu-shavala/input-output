import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnChanges {
  @Input() value: number;
  radius = 54;
  circumference = 2 * Math.PI * this.radius;
  dashoffset: number;

  constructor() {
    this.progress(0);
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value.currentValue !== changes.value.previousValue) {
      this.progress(changes.value.currentValue);
    }
  }

  toFixed(val) {
    return Number(Number(val).toFixed(1))
  }

  private progress(value: number) {
    const progress = value / 100;
    this.dashoffset = this.circumference * (1 - progress);
  }
}
