import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class UtilityService
{
	public getCurrentDateTime(onlyDate: boolean = false): string
	{
		const today = new Date();
		const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
		const dateTime = date + '_' + time;
		return onlyDate ? date : dateTime;
	}
}
