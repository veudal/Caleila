import { Component, OnInit } from '@angular/core';
import { MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UUIDService } from '../services/uuid.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

export interface Goal {
  id: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css',
  standalone: true,
  imports: [MatButtonToggle, MatButtonToggleGroup, MatCheckboxModule, CommonModule, FormsModule, MatTableModule, MatIconModule, MatButtonModule, MatFormField, MatLabel, MatInput, DragDropModule]
})

export class GoalsComponent implements OnInit {
  displayedColumns: string[] = ['dragHandle', 'index', 'completed', 'goal', 'delete'];
  selectedTab = "monthly-goals";
  dataSource = new MatTableDataSource<Goal>();
  currentFocusedIndex: number = -1;
  dragDisabled = true;
  month = "";
  week = "";

  ngOnInit() {
    this.loadGoals();
    this.month = this.getCurrentMonth();
    this.week = this.getCurrentWeek();
  }

  private getCurrentMonth() {
    const monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthsArr[(new Date).getMonth()];
  }

  private getCurrentWeek() {
    const today = new Date();
    const currentDay = today.getDay();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
    const startDateFormatted = startOfWeek.toLocaleDateString('de-DE', options).slice(0, -1);
    const endDateFormatted = endOfWeek.toLocaleDateString('de-DE', options).slice(0, -1);

    return `${startDateFormatted} - ${endDateFormatted}`;
  }

  private loadGoals() {
    const local = localStorage.getItem(this.selectedTab);
    if (local) {
      this.dataSource.data = JSON.parse(local);
    }
    else {
      this.dataSource.data = [];
    }

    this.dataSource._updateChangeSubscription();
  }

  onToggleButtonGroup(event: MatButtonToggleChange) {
    this.selectedTab = event.value + "-goals";
    this.loadGoals();
  }

  onDescriptionChange() {
    localStorage.setItem(this.selectedTab, JSON.stringify(this.dataSource.data));
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key == "Enter" || event.key == "Escape") {
      (event.target as HTMLElement).blur()
    }
  }

  onToggleCompleted() {
    localStorage.setItem(this.selectedTab, JSON.stringify(this.dataSource.data));
  }

  deleteGoal(goal: Goal) {
    this.dataSource.data = this.dataSource.data.filter(item => item.id !== goal.id);
    localStorage.setItem(this.selectedTab, JSON.stringify(this.dataSource.data));
  }

  addGoal() {
    const goal: Goal = { description: '', completed: false, id: UUIDService.generateUUID() };
    this.dataSource.data.push(goal);
    this.dataSource._updateChangeSubscription();

    localStorage.setItem(this.selectedTab, JSON.stringify(this.dataSource.data));

    // Select the input box of the new goal
    const allInputs = document.querySelectorAll('input[matInput]');
    const lastInput = allInputs[allInputs.length - 1] as HTMLElement;
    if (lastInput) {
      lastInput.focus();
    }
  }

  drop(event: CdkDragDrop<Goal[]>): void {
    this.dragDisabled = true;

    const previousIndex = this.dataSource.data.findIndex((d: any) => d === event.item.data);
    moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
    this.dataSource._updateChangeSubscription();

    localStorage.setItem(this.selectedTab, JSON.stringify(this.dataSource.data));
  }
}
