import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCardNameComponent } from './list-card-name.component';

describe('ListCardNameComponent', () =>
{
	let component: ListCardNameComponent;
	let fixture: ComponentFixture<ListCardNameComponent>;

	beforeEach(async(() =>
	{
		TestBed.configureTestingModule({
			declarations: [ListCardNameComponent],
		})
			.compileComponents();
	}));

	beforeEach(() =>
	{
		fixture = TestBed.createComponent(ListCardNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () =>
	{
		expect(component).toBeTruthy();
	});
});
