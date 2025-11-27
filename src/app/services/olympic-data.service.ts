import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { Country, Participation } from '../models';

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
	providedIn: 'root'
})
export class OlympicDataService {
	private readonly olympicUrl = './assets/mock/olympic.json';

	// Cache des données pour éviter plusieurs requêtes HTTP
	private readonly olympics$: Observable<Country[]> = this.http
		.get<Country[]>(this.olympicUrl)
		.pipe(
			shareReplay(1),
			catchError((error: HttpErrorResponse) => {
				console.error('Erreur lors du chargement des données olympiques', error);
				return throwError(() => error);
			})
		);

	constructor(private http: HttpClient) {}

	/**
	 * Donne la liste brute des pays + participations
	 */
	getAllCountries(): Observable<Country[]> {
		return this.olympics$;
	}

	/**
	 * Stats globales pour la page Home :
	 * - nombre de pays
	 * - nombre de JOs distincts
	 * - total de médailles par pays
	 */
	getGlobalStats(): Observable<GlobalStats> {
		return this.olympics$.pipe(
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
						totalMedals: totalMedalsForCountry
					};
				});

				return {
					totalCountries: countries.length,
					totalJOs: yearsSet.size,
					medalsByCountry
				};
			})
		);
	}

	/**
	 * Détail d’un pays pour la page Country :
	 * - infos du pays
	 * - nb de participations
	 * - total médailles / athlètes
	 * - séries pour le line chart (years / medals)
	 */
	getCountryDetails(countryName: string): Observable<CountryDetails | null> {
		return this.olympics$.pipe(
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
					medals
				};
			})
		);
	}
}
