import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogCardNameComponent } from './log-card-name.component';

describe('ListCardNameComponent', () =>
{
	let component: LogCardNameComponent;
	let fixture: ComponentFixture<LogCardNameComponent>;

	beforeEach(async(() =>
	{
		TestBed.configureTestingModule({
			declarations: [LogCardNameComponent],
		})
			.compileComponents();
	}));

	beforeEach(() =>
	{
		fixture = TestBed.createComponent(LogCardNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () =>
	{
		expect(component).toBeTruthy();
	});
});
