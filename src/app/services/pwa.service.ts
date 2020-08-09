import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker'; @Injectable()

@Injectable()
export class PwaService
{
	// public promptEvent: Event;

	constructor(private swUpdate: SwUpdate)
	{
		swUpdate.available.subscribe(event =>
		{
			if (this.askUserToUpdate())
			{
				window.location.reload();
			}
		});
		// window.addEventListener('beforeinstallprompt', event =>
		// {
		// 	this.promptEvent = event;
		// });
	}

	public askUserToUpdate()
	{
		return confirm('There is an update available, do you wish to update the app?');
	}
}
