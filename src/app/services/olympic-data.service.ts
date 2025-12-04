import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, shareReplay, throwError } from 'rxjs';
import { Country } from '../models';

@Injectable({
	providedIn: 'root',
})
export class OlympicDataService {
	private readonly olympicUrl = './assets/mock/olympic.json';

	private readonly olympics$: Observable<Country[]> = this.http
		.get<Country[]>(this.olympicUrl)
		.pipe(
			shareReplay(1),
			catchError((error: HttpErrorResponse) => {
				console.error('Erreur lors du chargement des données olympiques', error);
				return throwError(() => error);
			})
		);

	constructor(private readonly http: HttpClient) {}

	/**
	 * Données brutes depuis le JSON
	 */
	getOlympics(): Observable<Country[]> {
		return this.olympics$;
	}
}
