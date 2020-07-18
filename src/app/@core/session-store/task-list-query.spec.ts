import { TestBed } from '@angular/core/testing';

import { TaskListQuery } from './task-list-query';

describe('TaskListQueryService', () =>
{
	let service: TaskListQuery;

	beforeEach(() =>
	{
		TestBed.configureTestingModule({});
		service = TestBed.inject(TaskListQuery);
	});

	it('should be created', () =>
	{
		expect(service).toBeTruthy();
	});
});
