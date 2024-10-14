import { Component, inject } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { CalendarModule } from '../calendar/calendar.module';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OnInit } from '@angular/core';
import { MotivationQuotesService } from '../services/motivation-quotes.service';
import { NotesComponent } from '../notes/notes.component';
import { ToDoComponent } from '../to-do/to-do.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [CommonModule, MatTabsModule, CalendarModule, NotesComponent, ToDoComponent],
})
export class HomeComponent implements OnInit {
  constructor(private motivationQuotesService: MotivationQuotesService) { }
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    const quote = this.motivationQuotesService.GetQuote();
    this.snackBar.open(quote, "Oke ❤️");
  }
}
