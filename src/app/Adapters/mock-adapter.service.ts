import { Injectable } from '@angular/core';
import { TaskListStore } from '../@core/session-store/task-list-store';
import { IList } from '../@core/session-store/taskListModel';

/**
 * This adapter is using local storage temporarely instead of db api conection
 */

@Injectable({
	providedIn: 'root',
})
export class MockAdapter {
	private readonly localDBName: string = 'RodTaskListApp';
	constructor(
		private store: TaskListStore,
	) {
	}

	// api call to load DB records into state
	public loadAll(): void {
		if (!localStorage.getItem(this.localDBName)) {
			localStorage.setItem(this.localDBName, '{}');
		}

		const allLists = JSON.parse(localStorage.getItem(this.localDBName));
		Object.keys(allLists).forEach(key => {
			this.store.upsert(allLists[key].id, allLists[key]);
		});
	}

	public upsert(taskList: IList): void {
		const allDB = this.getLocalStorageObject();
		allDB[taskList.id] = taskList;
		this.mapAndSetLocalStorage(allDB);
	}

	public update(taskList: Partial<IList>): void {
		const allDb = this.getLocalStorageObject();

		if (taskList.title) { allDb[taskList.id].title = taskList.title; }
		if (taskList.content) { allDb[taskList.id].content = taskList.content; }
		this.mapAndSetLocalStorage(allDb);
	}

	public delete(id: string): void {
		this.store.remove(id);
		const allDb = this.getLocalStorageObject();
		delete allDb[id];
		this.mapAndSetLocalStorage(allDb);
	}

	public restoreData(data: string): void {
		localStorage.setItem(this.localDBName, data);
		this.loadAll();
	}

	private getLocalStorageObject(): {} {
		return JSON.parse(localStorage.getItem(this.localDBName));
	}

	private mapAndSetLocalStorage(db: {}): void {
		localStorage.setItem(this.localDBName, JSON.stringify(db));
		this.loadAll();
	}
}
