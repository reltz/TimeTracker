import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Observable } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, switchMap, take, takeWhile, tap, timestamp } from 'rxjs/operators';
import { v4 } from 'uuid';
import { TimeTrackerQuery } from '../@core/session-store/time-tracker-query';
import { TimeTrackerService } from '../@core/session-store/time-tracker.service';
import { IContent, ILog } from '../@core/session-store/timeTrackerModel';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
	selector: 'app-log-view',
	templateUrl: './log-view.component.html',
	styleUrls: ['./log-view.component.scss'],
})
export class LogViewComponent implements OnInit, OnDestroy
{
	@ViewChild('focusTitle') public title: ElementRef;
	@Input() public providedLog: ILog;
	public currentLog$: Observable<ILog>;
	private currentLog: ILog;
	public timeMissing$: Observable<string>;
	public formGroup: FormGroup;
	public allContent: FormArray;
	private isAlive = true;

	constructor(
		private query: TimeTrackerQuery,
		private svc: TimeTrackerService,
		protected readonly dialog: MatDialog,
	) { }

	public ngOnInit(): void
	{
		this.formGroup = new FormGroup({
			id: new FormControl(''),
			name: new FormControl(''),
			totalTime: new FormControl('8h', Validators.pattern("^[0-9]*$")),
		});
		this.allContent = new FormArray([]);

		if (!!this.providedLog)
		{
			this.currentLog$ = this.query.selectEntity(this.providedLog.id);
			this.currentLog$.pipe(
				takeWhile(() => this.isAlive),
				filter(current => !!current),
				delay(200),
				tap((x) =>
				{
					this.currentLog = x;
					this.allContent.reset();
				}),
			).subscribe(values =>
			{
				if (this.formGroup.controls.id.value === values.id)
				{
					this.formGroup.markAsPristine();
				}
				else
				{
					this.formGroup.controls.id.setValue(values.id);
					this.formGroup.controls.name.setValue(values.title);
					this.formGroup.controls.totalTime.setValue(values.totalTime);
				}

				this.formGroup.controls.name.setValue(values.title);
				values.content.forEach(item =>
				{
					this.allContent.push(this.createContentControls(item.id, item.text, item.time, item.isChecked));
				});
			});
		}
		else
		{
			this.currentLog$ = this.query.activeLog$;

			combineLatest(this.currentLog$, this.query.isThereActive$).pipe(
				filter(([cur, active]) => !!cur && !!active),
				takeWhile(() => this.isAlive),
				map(([cur, active]) => cur),
				delay(200),
				tap(x =>
				{
					this.currentLog = x;
					this.allContent.reset();
				}),
			).subscribe(values =>
			{
				if (this.formGroup.controls.id.value === values.id)
				{
					this.formGroup.markAsPristine();
				}
				else
				{
					this.formGroup.controls.id.setValue(values.id);
					this.formGroup.controls.name.setValue(values.title);
				}

				this.formGroup.controls.name.setValue(values.title);
				values.content.forEach(item =>
				{
					this.allContent.push(this.createContentControls(item.id, item.text, item.time, item.isChecked));
				});
			});
		}

		this.timeMissing$ = combineLatest(this.formGroup.valueChanges, this.allContent.valueChanges).pipe(
			map(([x, y]) => this.calculateTimeLeft()),
		);
	}

	public ngOnDestroy()
	{
		this.isAlive = false;
	}

	public calculateTimeLeft()
	{
		const totalTime = this.formGroup.controls.totalTime.value;
		const totalNumber = this.getMinutesFromString(totalTime);
		console.warn(this.allContent);
		const allContentGroups = this.allContent.controls as FormGroup[];
		let accumulator = 0;

		allContentGroups.forEach(each =>
		{
			if (!!each.controls.isChecked.value)
			{
				accumulator += this.getMinutesFromString(each.controls.time.value);
			}
			else
			{
				console.warn(each.controls.text.value);
			}
		});

		const difference = totalNumber - accumulator;
		const hoursLeft = Math.ceil(difference / 60);
		const minutesLeft = difference % 60;
		return !!difference ? `Pending ${hoursLeft}h, ${minutesLeft}m time to log` : '';
	}

	private getMinutesFromString(sTime: string): number
	{
		if (sTime.length === 1)
		{
			// tslint:disable-next-line:radix
			return parseInt(sTime);
		}
		const newString = sTime.toLowerCase();
		if (newString.includes('h'))
		{
			const h = newString.split('h');
			// tslint:disable-next-line:radix
			const hour = parseInt(h[0]);
			// tslint:disable-next-line:radix
			const minutes = h[1] !== '' ? parseInt(h[1].split('m')[0].trim()) : 0;
			return (hour * 60) + minutes;
		} else if (newString.includes('m'))
		{
			// tslint:disable-next-line:radix
			return parseInt(newString.split('m')[0]);
		}
	}

	public addItem(): void
	{
		const id = v4();
		this.allContent.push(this.createContentControls(id, '', ''));
	}

	public deleteItem(itemId: string): void
	{
		const id = this.formGroup.get('id').value;
		const content = this.mapFormGroupToListContent(itemId);
		console.info('deleting : final content: ', content);

		this.svc.update({ id, content });
	}

	public saveLog()
	{
		const id = this.formGroup.get('id').value;
		const content = this.mapFormGroupToListContent();
		this.svc.update({ id, content, title: this.formGroup.get('name').value });
	}

	public deleteLog()
	{
		const logName = this.currentLog.title;
		let active: ILog;
		this.dialog.open(ConfirmDeleteDialogComponent, { data: { Name: logName } })
			.afterClosed().pipe(
				filter(confirmed => !!confirmed),
				switchMap(() => this.query.activeLog$),
				tap(x => active = x),
				take(1),
			).subscribe(x =>
			{
				if (this.currentLog && active && this.currentLog.id === active.id)
				{
					this.svc.unsetActive();
				}
				this.svc.delete(this.currentLog.id);
			});
	}

	public selectAllText()
	{
		this.title.nativeElement.select();
	}

	public toggleCheck(itemId: string)
	{
		const toUpdate = this.allContent.controls.find(group => group.value.id === itemId).get('isChecked');
		toUpdate.setValue(!toUpdate.value);
		this.saveLog();
	}

	private mapFormGroupToListContent(itemId?: string): IContent[]
	{
		const content: IContent[] = [];

		this.allContent.controls.forEach(each =>
		{
			const id = each.get('id').value;
			const text = each.get('text').value;
			const isChecked = each.get('isChecked').value;
			const time = each.get('time').value;

			if (itemId !== id)
			{
				content.push({
					id,
					text,
					isChecked,
					time,
				});
			}
		});
		return content;
	}

	private createContentControls(id: string, text: string, time: string, isChecked: boolean = false)
	{
		return new FormGroup({
			id: new FormControl(id),
			text: new FormControl(text),
			isChecked: new FormControl(isChecked),
			time: new FormControl(time),
		});
	}

}
