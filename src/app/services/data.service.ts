import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Country, Participation } from '../models';
import { OlympicDataService } from './olympic-data.service';

export interface GlobalStats {
	totalCountries: number;
	totalJOs: number;
	medalsByCountry: {
		country: string;
		totalMedals: number;
	}[];
}

export interface CountryDetails {
	country: Country;
	totalEntries: number;
	totalMedals: number;
	totalAthletes: number;
	years: number[];
	medals: number[];
}

@Injectable({
	providedIn: 'root',
})
export class DataService {
	constructor(private readonly olympicDataService: OlympicDataService) {}

	/**
	 * Données pour la home :
	 * - nb de pays
	 * - nb de JO distincts
	 * - total de médailles par pays
	 */
	getGlobalStats(): Observable<GlobalStats> {
		return this.olympicDataService.getOlympics().pipe(
			map((countries: Country[]) => {
				const yearsSet = new Set<number>();

				const medalsByCountry = countries.map((country: Country) => {
					let totalMedalsForCountry = 0;

					country.participations.forEach((p: Participation) => {
						yearsSet.add(p.year);
						totalMedalsForCountry += p.medalsCount;
					});

					return {
						country: country.country,
						totalMedals: totalMedalsForCountry,
					};
				});

				return {
					totalCountries: countries.length,
					totalJOs: yearsSet.size,
					medalsByCountry,
				};
			})
		);
	}

	/**
	 * Données pour la page Country :
	 * - stats globales du pays
	 * - séries pour le graphique
	 */
	getCountryDetails(countryName: string): Observable<CountryDetails | null> {
		return this.olympicDataService.getOlympics().pipe(
			map((countries: Country[]) => {
				const country = countries.find(
					(c: Country) => c.country === countryName
				);

				if (!country) {
					return null;
				}

				const years: number[] = [];
				const medals: number[] = [];
				let totalMedals = 0;
				let totalAthletes = 0;

				country.participations.forEach((p: Participation) => {
					years.push(p.year);
					medals.push(p.medalsCount);
					totalMedals += p.medalsCount;
					totalAthletes += p.athleteCount;
				});

				return {
					country,
					totalEntries: country.participations.length,
					totalMedals,
					totalAthletes,
					years,
					medals,
				};
			})
		);
	}
}
