import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockAdapter } from '../app/Adapters/mock-adapter.service';
import { TaskListQuery } from './@core/session-store/task-list-query';
import { TaskListStore } from './@core/session-store/task-list-store';
import { TaskListService } from './@core/session-store/task-list.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListCardNameComponent } from './list-card-name/list-card-name.component';

const matModules = [MatCardModule, MatIconModule, MatButtonModule];

@NgModule({
	declarations: [
		AppComponent,
		ListCardNameComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
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
