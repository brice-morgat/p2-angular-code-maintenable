import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Country } from '../models';

@Injectable({
	providedIn: 'root',
})
export class OlympicDataService {
	private readonly olympicUrl = './assets/mock/olympic.json';

	private readonly olympicsSubject = new BehaviorSubject<Country[]>([]);
	private readonly olympics$ = this.olympicsSubject.asObservable();

	constructor(private readonly http: HttpClient) {
		this.loadOlympics();
	}

	/**
	 * Donnees brutes depuis le JSON
	 */
	getOlympics(): Observable<Country[]> {
		return this.olympics$;
	}

	private loadOlympics(): void {
		this.http
			.get<Country[]>(this.olympicUrl)
			.pipe(
				catchError((error: HttpErrorResponse) => {
					console.error('Erreur lors du chargement des donnees olympiques', error);
					return throwError(() => error);
				})
			)
			.subscribe({
				next: (countries: Country[]) => this.olympicsSubject.next(countries),
			});
	}
}
