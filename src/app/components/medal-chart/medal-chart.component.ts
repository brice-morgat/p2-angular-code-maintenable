import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-medal-chart',
  templateUrl: './medal-chart.component.html',
  styleUrls: ['./medal-chart.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MedalChartComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() labels: (string | number)[] = [];
  @Input() data: number[] = [];
  @Input() datasetLabel: string = 'Medals';

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewReady) return;
    if (changes['labels'] || changes['data']) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (!this.chartCanvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.datasetLabel,
            data: this.data,
            backgroundColor: '#0b868f',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
