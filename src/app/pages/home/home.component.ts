import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService, GlobalStats } from '../../services/data.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	public totalCountries: number = 0;
	public totalJOs: number = 0;
	public error: string = '';
	public titlePage: string = 'Medals per Country';

	public chartCountries: string[] = [];
	public chartMedalsByCountry: number[] = [];

	constructor(
		private readonly router: Router,
		private readonly dataService: DataService
	) {}

	ngOnInit(): void {
		this.dataService.getGlobalStats().subscribe({
			next: (stats: GlobalStats) => {
				this.totalCountries = stats.totalCountries;
				this.totalJOs = stats.totalJOs;

				this.chartCountries = stats.medalsByCountry.map((m) => m.country);
				this.chartMedalsByCountry = stats.medalsByCountry.map(
					(m) => m.totalMedals
				);
			},
			error: (error: HttpErrorResponse) => {
				console.error(
					'Erreur lors de la récupération des statistiques',
					error
				);
				this.error = error.message;
			},
		});
	}

	onCountrySelected(countryName: string): void {
		if (countryName) {
			this.router.navigate(['country', countryName]);
		}
	}
}
