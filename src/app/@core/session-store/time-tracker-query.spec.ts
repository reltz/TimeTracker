import { TestBed } from '@angular/core/testing';

import { TimeTrackerQuery } from './time-tracker-query';

describe('TaskListQueryService', () =>
{
	let service: TimeTrackerQuery;

	beforeEach(() =>
	{
		TestBed.configureTestingModule({});
		service = TestBed.inject(TimeTrackerQuery);
	});

	it('should be created', () =>
	{
		expect(service).toBeTruthy();
	});
});
