import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Subscription, switchMap } from 'rxjs';
import { OlympicDataService, CountryDetails } from '../../services/olympic-data.service';

@Component({
	selector: 'app-country',
	templateUrl: './country.component.html',
	styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit, OnDestroy {
	public titlePage: string = '';
	public totalEntries: number = 0;
	public totalMedals: number = 0;
	public totalAthletes: number = 0;
	public error: string = '';

	// données pour le graphique
	public chartYears: (number | string)[] = [];
	public chartMedals: number[] = [];

	private subscription?: Subscription;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly olympicDataService: OlympicDataService
	) {}

	ngOnInit(): void {
		this.subscription = this.route.paramMap
			.pipe(
				switchMap((params: ParamMap) => {
					const countryName = params.get('countryName');
					if (!countryName) {
						this.error = 'No country selected';
						return of<CountryDetails | null>(null);
					}
					return this.olympicDataService.getCountryDetails(countryName);
				})
			)
			.subscribe({
				next: (details: CountryDetails | null) => {
					if (!details) {
						this.error = 'Country not found';
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
					this.error = err.message;
				},
			});
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}
}
