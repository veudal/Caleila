import { Component, ViewEncapsulation, inject, isDevMode } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OnInit } from '@angular/core';
import { MotivationQuotesService } from '../services/motivation-quotes.service';
import { NotesComponent } from '../notes/notes.component';
import { ToDoComponent } from '../to-do/to-do.component';
import { GoalsComponent } from '../goals/goals.component';
import { TasksComponent } from '../tasks/tasks.component';
import { CollageComponent } from '../collage/collage.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, MatTabsModule, TasksComponent, GoalsComponent, NotesComponent, ToDoComponent, CollageComponent]
})

export class HomeComponent implements OnInit {
  constructor(private motivationQuotesService: MotivationQuotesService) { }
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    if (isDevMode()) {
      return;
    }
    const quote = this.motivationQuotesService.GetQuote();
    this.snackBar.open(quote, "Oke ❤️", {
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }
}
