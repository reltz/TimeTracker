import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Observable } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, pairwise, startWith, switchMap, take, takeWhile, tap, timestamp } from 'rxjs/operators';
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
	public currentLog$: Observable<ILog>;
	public timeMissing$: Observable<string>;
	public formGroup: FormGroup;
	public allContent: FormArray;
	private isAlive = true;
	public completed: boolean;

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

		this.currentLog$ = this.query.activeLog$;

		this.currentLog$.pipe(
			filter(cur => !!cur),
			startWith(null),
			tap(x => console.warn(x)),
			takeWhile(() => this.isAlive),
			pairwise(),
		).subscribe(values =>
		{
			this.inti(values);
		});

		this.timeMissing$ = combineLatest(this.formGroup.valueChanges, this.allContent.valueChanges).pipe(
			map(([x, y]) => this.calculateTimeLeft()),
		);
	}

	private inti(prevCur: ILog[])
	{
		const currValues = prevCur[1];
		if (this.formGroup.controls.id.value === currValues.id)
		{
			this.formGroup.markAsPristine();
		}
		else
		{
			console.warn('title is ', currValues.title);
			this.formGroup.controls.id.setValue(currValues.id);
			this.formGroup.controls.name.setValue(currValues.title);
			this.formGroup.controls.totalTime.setValue(currValues.totalTime);
		}

		if (this.allContent.length === 0 || prevCur[0].id !== prevCur[1].id)
		{
			this.allContent.reset();
			currValues.content.forEach(item =>
			{
				this.allContent.push(this.createContentControls(item.id, item.text, item.time, item.isChecked));
			});
		}
	}

	public ngOnDestroy()
	{
		this.isAlive = false;
	}

	public calculateTimeLeft()
	{
		const totalTime = this.formGroup.controls.totalTime.value;
		const totalNumber = this.getMinutesFromString(totalTime);
		const allContentGroups = this.allContent.controls as FormGroup[];
		if (allContentGroups.length === 0) { return null; }
		let accumulator = 0;

		allContentGroups.forEach(each =>
		{
			// if (!!each.controls.isChecked.value)
			if (each.controls.time.value)
			{
				accumulator += this.getMinutesFromString(each.controls.time.value);
			}
		});

		const difference = totalNumber - accumulator;
		const hoursLeft = Math.ceil(difference / 60);
		const minutesLeft = difference % 60;
		if (difference === 0) { this.completed = true; }
		return !!difference ? `Pending ${hoursLeft}h, ${minutesLeft}m time to log` : '';
	}

	private getMinutesFromString(sTime: string): number
	{
		if (sTime.length === 1)
		{
			// tslint:disable-next-line:radix
			return Math.ceil(parseInt(sTime)) * 60;
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
		const index = (this.allContent.controls as FormGroup[]).findIndex(x => x.controls.id.value === itemId);
		this.allContent.removeAt(index);

		this.svc.update({ id, content });
	}

	public saveLog()
	{
		const id = this.formGroup.get('id').value;
		const totalTime = this.formGroup.get('totalTime').value;
		const content = this.mapFormGroupToListContent();
		this.svc.update({ id, totalTime, content, title: this.formGroup.get('name').value });
		this.allContent.markAsPristine();
		this.formGroup.markAsPristine();
	}

	public deleteLog()
	{
		const activeLog = this.query.getActive();
		this.dialog.open(ConfirmDeleteDialogComponent, { data: { Name: activeLog.title } })
			.afterClosed().pipe(
				filter(confirmed => !!confirmed),
				take(1),
			).subscribe(() =>
			{
				this.svc.unsetActive();
				this.svc.delete(activeLog.id);
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
