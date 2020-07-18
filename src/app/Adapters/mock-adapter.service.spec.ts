import { TestBed } from '@angular/core/testing';

import { MockAdapter } from './mock-adapter.service';

describe('MockAdapterService', () =>
{
	let service: MockAdapter;

	beforeEach(() =>
	{
		TestBed.configureTestingModule({});
		service = TestBed.inject(MockAdapter);
	});

	it('should be created', () =>
	{
		expect(service).toBeTruthy();
	});
});
