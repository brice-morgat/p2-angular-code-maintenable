import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
	selector: 'app-country-chart',
	templateUrl: './medal-country-chart.component.html',
	styleUrls: ['./medal-country-chart.component.scss'],
})
export class MedalCountryChartComponent
	implements AfterViewInit, OnChanges, OnDestroy
{
	@Input() labels: string[] = [];
	@Input() data: number[] = [];
	@Input() datasetLabel: string = 'Medals';

	@Output() countrySelected = new EventEmitter<string>();

	@ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

	private chart?: Chart<'pie', number[], string>;
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
		if (!this.chartCanvas || !this.labels?.length || !this.data?.length) {
			return;
		}

		if (this.chart) {
			this.chart.destroy();
		}

		const chart = new Chart<'pie', number[], string>(
			this.chartCanvas.nativeElement,
			{
				type: 'pie',
				data: {
					labels: this.labels,
					datasets: [
						{
							label: this.datasetLabel,
							data: this.data,
							backgroundColor: [
								'#0b868f',
								'#adc3de',
								'#7a3c53',
								'#8f6263',
								'orange',
								'#94819d',
							],
							hoverOffset: 4,
						},
					],
				},
				options: {
					responsive: true,
					aspectRatio: 3,
					onClick: (e) => {
						if (e.native) {
							const points = chart.getElementsAtEventForMode(
								e.native,
								'point',
								{ intersect: true },
								true
							);
							if (points.length) {
								const firstPoint = points[0];
								const label = chart.data.labels
									? (chart.data.labels[firstPoint.index] as string)
									: '';
								if (label) {
									this.countrySelected.emit(label);
								}
							}
						}
					},
				},
			}
		);

		this.chart = chart;
	}

	ngOnDestroy(): void {
		if (this.chart) {
			this.chart.destroy();
		}
	}
}
