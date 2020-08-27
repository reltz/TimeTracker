import { TestBed } from '@angular/core/testing';

import { TimeTrackerStore } from './time-tracker-store';

describe('TaskListStoreService', () =>
{
	let service: TimeTrackerStore;

	beforeEach(() =>
	{
		TestBed.configureTestingModule({});
		service = TestBed.inject(TimeTrackerStore);
	});

	it('should be created', () =>
	{
		expect(service).toBeTruthy();
	});
});
