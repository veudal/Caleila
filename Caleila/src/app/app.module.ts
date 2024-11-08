import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToDoComponent } from './to-do/to-do.component';
import { NotesComponent } from './notes/notes.component';
import { GoalsComponent } from './goals/goals.component';
import { TasksComponent } from './tasks/tasks.component';
import { CollageComponent } from './collage/collage.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    TasksComponent,
    GoalsComponent,
    ToDoComponent,
    NotesComponent,
    CollageComponent,
    HomeComponent,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatNativeDateModule, 
  ],
  bootstrap: [AppComponent],
  providers: [
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }
  ]
})
export class AppModule { }
