import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockAdapter } from '../app/Adapters/mock-adapter.service';
import { TaskListQuery } from './@core/session-store/task-list-query';
import { TaskListStore } from './@core/session-store/task-list-store';
import { TaskListService } from './@core/session-store/task-list.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListCardNameComponent } from './list-card-name/list-card-name.component';
import { ListViewComponent } from './list-view/list-view.component';

const matModules = [
	MatCardModule,
	MatIconModule,
	MatButtonModule,
	MatCheckboxModule,
	MatFormFieldModule,
	MatInputModule,
];

@NgModule({
	declarations: [
		AppComponent,
		ListCardNameComponent,
		ListViewComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		...matModules,
	],
	providers: [
		TaskListService,
		TaskListStore,
		TaskListQuery,
		MockAdapter,
	],
	bootstrap: [AppComponent],
})

export class AppModule { }
