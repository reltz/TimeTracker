import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take, takeWhile, tap } from 'rxjs/operators';
import { TimeTrackerQuery } from '../@core/session-store/time-tracker-query';
import { TimeTrackerService } from '../@core/session-store/time-tracker.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
	selector: 'app-log-card-name',
	templateUrl: './log-card-name.component.html',
	styleUrls: ['./log-card-name.component.scss'],
})
export class LogCardNameComponent implements OnInit, OnDestroy
{
	@Input() public id: string;
	public logName$: Observable<string>;
	private isAlive: boolean = true;
	public isActiveOne: boolean;

	constructor(
		private query: TimeTrackerQuery,
		private svc: TimeTrackerService,
		protected readonly dialog: MatDialog,
	) { }

	public ngOnInit(): void
	{
		this.logName$ = this.query.selectEntity(this.id)
			.pipe(
				takeWhile(() => this.isAlive),
				filter(list => !!list),
				map(list => list.title),
			);

		combineLatest(this.query.activeLog$, this.query.isThereActive$)
			.pipe(
				takeWhile(() => this.isAlive),
				filter(([curr, active]) => !!active),
				map(([curr, active]) => curr),
			).subscribe(active =>
			{
				active.id === this.id
					? this.isActiveOne = true
					: this.isActiveOne = false;
			});
	}

	public clickHandler()
	{
		this.svc.setActive(this.id);
	}

	public deleteLog()
	{
		const logName = this.query.getEntity(this.id).title;
		this.dialog.open(ConfirmDeleteDialogComponent, { data: { Name: logName } })
			.afterClosed().pipe(
				filter(confirmed => !!confirmed),
				take(1),
			).subscribe(() =>
			{
				if (this.isActiveOne)
				{
					this.svc.unsetActive();
				}
				this.svc.delete(this.id);
			});
	}

	public ngOnDestroy()
	{
		this.isAlive = false;
	}
}
