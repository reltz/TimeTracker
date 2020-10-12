import { Injectable } from '@angular/core';
import { TimeTrackerStore } from '../@core/session-store/time-tracker-store';
import { ILog } from '../@core/session-store/timeTrackerModel';

/**
 * This adapter is using local storage temporarely instead of db api conection
 */

@Injectable({
	providedIn: 'root',
})
export class MockAdapter
{
	private readonly localDBName: string = 'TimeTrackerApp';
	constructor(
		private store: TimeTrackerStore,
	)
	{
	}

	// api call to load DB records into state
	public loadAll(): void
	{
		if (!localStorage.getItem(this.localDBName))
		{
			localStorage.setItem(this.localDBName, '{}');
		}

		const allLogs = JSON.parse(localStorage.getItem(this.localDBName));
		Object.keys(allLogs).forEach(key =>
		{
			this.store.upsert(allLogs[key].id, allLogs[key]);
		});
	}

	public upsert(log: ILog): void
	{
		const allDB = this.getLocalStorageObject();
		allDB[log.id] = log;
		this.mapAndSetLocalStorage(allDB);
	}

	public update(log: Partial<ILog>): void
	{
		const allDb = this.getLocalStorageObject();

		if (log.title) { allDb[log.id].title = log.title; }
		if (log.totalTime) { allDb[log.id].totalTime = log.totalTime; }
		if (log.content) { allDb[log.id].content = log.content; }
		this.mapAndSetLocalStorage(allDb);
	}

	public delete(id: string): void
	{
		this.store.remove(id);
		const allDb = this.getLocalStorageObject();
		delete allDb[id];
		this.mapAndSetLocalStorage(allDb);
	}

	public restoreData(data: string): void
	{
		localStorage.setItem(this.localDBName, data);
		this.loadAll();
	}

	private getLocalStorageObject(): {}
	{
		return JSON.parse(localStorage.getItem(this.localDBName));
	}

	private mapAndSetLocalStorage(db: {}): void
	{
		localStorage.setItem(this.localDBName, JSON.stringify(db));
		this.loadAll();
	}
}
