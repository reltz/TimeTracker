import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { TaskListStore } from '../@core/session-store/task-list-store';
import { ITaskList } from '../@core/session-store/taskListModel';

/**
 * This adapter is using local storage temporarely instead of db api conection
 */

@Injectable({
	providedIn: 'root',
})
export class MockAdapter
{
	private readonly localDBName: string = 'RodTaskListApp';
	constructor(
		private store: TaskListStore,
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

		const allLists = JSON.parse(localStorage.getItem(this.localDBName));
		Object.keys(allLists).forEach(key =>
		{
			this.store.upsert(allLists[key].id, allLists[key]);
		});
	}

	public upsert(taskList: ITaskList): void
	{
		const allDB = this.getLocalStorageObject();
		allDB[taskList.id] = taskList;
		this.mapAndSetLocalStorage(allDB);
	}

	public update(taskList: Partial<ITaskList>): void
	{
		const allDb = this.getLocalStorageObject();
		allDb[taskList.id] = taskList;
		this.mapAndSetLocalStorage(allDb);
	}

	public delete(id: string): void
	{
		this.store.remove(id);
		const allDb = this.getLocalStorageObject();
		delete allDb[id];
		this.mapAndSetLocalStorage(allDb);
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
