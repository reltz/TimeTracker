import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskListQuery } from './@core/session-store/task-list-query';
import { TaskListStore } from './@core/session-store/task-list-store';
import { TaskListService } from './@core/session-store/task-list.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListCardNameComponent } from './list-card-name/list-card-name.component';

@NgModule({
	declarations: [
		AppComponent,
		ListCardNameComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatCardModule,
	],
	providers: [
		TaskListService,
		TaskListStore,
		TaskListQuery,
	],
	bootstrap: [AppComponent],
})

export class AppModule { }
