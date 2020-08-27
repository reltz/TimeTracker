import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap, take, takeWhile, tap, timestamp } from 'rxjs/operators';
import { v4 } from 'uuid';
import { TaskListQuery } from '../@core/session-store/task-list-query';
import { TaskListService } from '../@core/session-store/task-list.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { IContent, IList } from './../@core/session-store/taskListModel';

@Component({
	selector: 'app-list-view',
	templateUrl: './list-view.component.html',
	styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnInit, OnDestroy
{
	@ViewChild('focusTitle') public title: ElementRef;
	@Input() public providedList: IList;
	public currentList$: Observable<IList>;
	private currentList: IList;
	public formGroup: FormGroup;
	public allContent: FormArray;
	private isAlive = true;

	constructor(
		private query: TaskListQuery,
		private svc: TaskListService,
		protected readonly dialog: MatDialog,
	) { }

	public ngOnInit(): void
	{
		this.formGroup = new FormGroup({
			id: new FormControl(''),
			name: new FormControl(''),
		});

		if (!!this.providedList)
		{
			this.currentList$ = this.query.selectEntity(this.providedList.id);
			this.currentList$.pipe(
				takeWhile(() => this.isAlive),
				filter(current => !!current),
				tap((x) =>
				{
					this.currentList = x;
					this.allContent = new FormArray([]);
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
					this.allContent.push(this.createContentControls(item.id, item.text, item.isChecked));
				});
			});
		}
		else
		{
			this.currentList$ = this.query.activeList$;

			combineLatest(this.currentList$, this.query.isThereActive$).pipe(
				filter(([cur, active]) => !!cur && !!active),
				takeWhile(() => this.isAlive),
				map(([cur, active]) => cur),
				tap(x =>
				{
					this.currentList = x;
					this.allContent = new FormArray([]);
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
					this.allContent.push(this.createContentControls(item.id, item.text, item.isChecked));
				});
			});
		}
	}

	public ngOnDestroy()
	{
		this.isAlive = false;
	}

	public addItem(): void
	{
		const id = v4();
		this.allContent.push(this.createContentControls(id, ''));
	}

	public deleteItem(itemId: string): void
	{
		const id = this.formGroup.get('id').value;
		const content = this.mapFormGroupToListContent(itemId);
		console.info('deleting : final content: ', content);

		this.svc.update({ id, content });
	}

	public saveList()
	{
		const id = this.formGroup.get('id').value;
		const content = this.mapFormGroupToListContent();
		this.svc.update({ id, content, title: this.formGroup.get('name').value });
	}

	public deleteList()
	{
		const listName = this.currentList.title;
		let active: IList;
		this.dialog.open(ConfirmDeleteDialogComponent, { data: { Name: listName } })
			.afterClosed().pipe(
				filter(confirmed => !!confirmed),
				switchMap(() => this.query.activeList$),
				tap(x => active = x),
				take(1),
			).subscribe(x =>
			{
				if (this.currentList && active && this.currentList.id === active.id)
				{
					this.svc.unsetActive();
				}
				this.svc.delete(this.currentList.id);
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
		this.saveList();
		console.warn('is checked??', this.allContent.controls);
	}

	private mapFormGroupToListContent(itemId?: string): IContent[]
	{
		const content: IContent[] = [];

		this.allContent.controls.forEach(each =>
		{
			const id = each.get('id').value;
			const text = each.get('text').value;
			const isChecked = each.get('isChecked').value;

			if (itemId !== id)
			{
				content.push({
					id,
					text,
					isChecked,
				});
			}
		});
		return content;
	}

	private createContentControls(id: string, text: string, isChecked: boolean = false)
	{
		return new FormGroup({
			id: new FormControl(id),
			text: new FormControl(text),
			isChecked: new FormControl(isChecked),
		});
	}

}
