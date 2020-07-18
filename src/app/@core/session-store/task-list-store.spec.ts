import { TestBed } from '@angular/core/testing';

import { TaskListStore } from './task-list-store';

describe('TaskListStoreService', () =>
{
	let service: TaskListStore;

	beforeEach(() =>
	{
		TestBed.configureTestingModule({});
		service = TestBed.inject(TaskListStore);
	});

	it('should be created', () =>
	{
		expect(service).toBeTruthy();
	});
});
