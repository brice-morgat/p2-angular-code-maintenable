import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Subscription, switchMap } from 'rxjs';
import { DataService, CountryDetails } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { CountryCardComponent } from 'src/app/components/country-card/country-card.component';
import { MedalChartComponent } from 'src/app/components/medal-chart/medal-chart.component';

@Component({
	selector: 'app-country',
	templateUrl: './country.component.html',
	styleUrls: ['./country.component.scss'],
	standalone: true,
	imports: [CommonModule, RouterLink, CountryCardComponent, MedalChartComponent],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryComponent implements OnInit, OnDestroy {
	titlePage: string = '';
	totalEntries: number = 0;
	totalMedals: number = 0;
	totalAthletes: number = 0;
	error: string = '';

	chartYears: (number | string)[] = [];
	chartMedals: number[] = [];

	private subscription?: Subscription;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly dataService: DataService
	) {}

	ngOnInit(): void {
		this.subscription = this.route.paramMap
			.pipe(
				switchMap((params: ParamMap) => {
					const countryName = params.get('countryName');
					if (!countryName) {
						this.router.navigate(['/not-found']);
						return of<CountryDetails | null>(null);
					}
					return this.dataService.getCountryDetails(countryName);
				})
			)
			.subscribe({
				next: (details: CountryDetails | null) => {
					if (!details) {
						this.router.navigate(['/not-found']);
						return;
					}

					this.titlePage = details.country.country;
					this.totalEntries = details.totalEntries;
					this.totalMedals = details.totalMedals;
					this.totalAthletes = details.totalAthletes;

					this.chartYears = details.years;
					this.chartMedals = details.medals;
				},
				error: (err: HttpErrorResponse) => {
					console.error('Erreur lors du chargement du pays', err);
					this.router.navigate(['/not-found']);
				},
			});
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}
}
