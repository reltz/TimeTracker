import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
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
    MatCardModule
],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
