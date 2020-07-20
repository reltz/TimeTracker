import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, takeWhile, tap, timestamp } from 'rxjs/operators';
import { v4 } from 'uuid';
import { TaskListQuery } from '../@core/session-store/task-list-query';
import { TaskListService } from '../@core/session-store/task-list.service';
import { ITaskList } from './../@core/session-store/taskListModel';

@Component({
	selector: 'app-list-view',
	templateUrl: './list-view.component.html',
	styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnInit, OnDestroy, AfterViewInit
{
	@ViewChild('focusTitle') public title: ElementRef;
	public currentList$: Observable<ITaskList>;
	public formGroup: FormGroup;
	public contentFormGroup: FormGroup;
	private isAlive = true;
	public controlsArraySize: string[];

	constructor(
		private query: TaskListQuery,
		private svc: TaskListService,
	)
	{ }

	public ngOnInit(): void
	{
		this.contentFormGroup = new FormGroup({});
		this.formGroup = new FormGroup({
			id: new FormControl(''),
			name: new FormControl(''),
			content: this.contentFormGroup,
		});

		this.currentList$ = this.query.activeList$;
		this.controlsArraySize = [];

		combineLatest(this.currentList$, this.query.isThereActive$).pipe(
			filter(([cur, active]) => !!cur && !!active),
			takeWhile(() => this.isAlive),
			tap(() =>
			{
				this.contentFormGroup = new FormGroup({});
				this.controlsArraySize = [];
			}),
			map(([cur, active]) => cur),
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
				this.contentFormGroup.addControl(v4(), new FormControl(item));
			});
			Object.keys(this.contentFormGroup.controls).forEach(item =>
			{
				this.controlsArraySize.push(item);
			});
		});
	}

	public ngAfterViewInit()
	{
		this.formGroup.controls.id.valueChanges
			.pipe(
				takeWhile(() => this.isAlive),
			)
			.subscribe(() =>
			{
				this.title.nativeElement.focus();
				this.title.nativeElement.select();
			});
	}

	public ngOnDestroy()
	{
		this.isAlive = false;
	}

	public addItem(): void
	{
		const id = v4();
		this.contentFormGroup.addControl(id, new FormControl(''));
		this.controlsArraySize.push(id);
	}

	public deleteItem(itemId: string): void
	{
		const id = this.formGroup.get('id').value;
		const content = this.mapFormGroupToListContent(this.contentFormGroup, itemId);

		this.svc.update({ id, content });
	}

	public saveList()
	{
		const id = this.formGroup.get('id').value;
		const content = this.mapFormGroupToListContent(this.contentFormGroup);
		this.svc.update({ id, content, title: this.formGroup.get('name').value });
	}

	private mapFormGroupToListContent(formGroup: FormGroup, itemIdToDelete?: string): string[]
	{
		const content: string[] = [];

		Object.keys(formGroup.controls).forEach(item =>
		{
			if (itemIdToDelete !== item)
			{
				content.push(formGroup.get(item).value);
			}
		});
		return content;
	}
}
