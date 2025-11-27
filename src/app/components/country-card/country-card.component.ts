import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-country-card',
	templateUrl: './country-card.component.html',
	styleUrls: ['./country-card.component.scss'],
})
export class CountryCardComponent {
	@Input() title: string = '';
	@Input() totalEntries: number = 0;
	@Input() totalMedals: number = 0;
	@Input() totalAthletes: number = 0;
}
