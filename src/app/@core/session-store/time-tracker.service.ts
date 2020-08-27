import { Injectable } from '@angular/core';
import { MockAdapter } from 'src/app/Adapters/mock-adapter.service';
import { TimeTrackerStore } from './time-tracker-store';
import { ILog } from './timeTrackerModel';

@Injectable({
	providedIn: 'root',
})
export class TimeTrackerService
{
	constructor(
		private store: TimeTrackerStore,
		private api: MockAdapter,
	) { }

	public loadAll()
	{
		this.api.loadAll();
	}

	public upsert(logItem: ILog)
	{
		this.api.upsert(logItem);
		this.setActive(logItem.id);
	}

	public update(logItem: Partial<ILog>)
	{
		this.api.update(logItem);
	}

	public delete(id: string)
	{
		this.api.delete(id);
	}

	public setActive(id: string)
	{
		this.store.update({ active: id });
	}

	public unsetActive()
	{
		this.store.update({ active: '' });
	}
}
