import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class UtilityService
{
	public getCurrentDateTime(onlyDate: boolean = false): string
	{
		const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const today = new Date();
		const weekDay = today.getDay();
		const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
		const dateTime = date + '_' + time;
		const weekDate = week[weekDay] + ' ' + date;
		return onlyDate ? weekDate : dateTime;
	}
}
