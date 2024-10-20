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

  ngOnInit() {
    this.loadGoals();
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
    console.log(this.selectedTab);
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

  deleteGoal(task: Goal) {
    this.dataSource.data = this.dataSource.data.filter(item => item.id !== task.id);
    localStorage.setItem(this.selectedTab, JSON.stringify(this.dataSource.data));
  }

  addGoal() {
    const task: Goal = { description: '', completed: false, id: UUIDService.generateUUID() };
    this.dataSource.data.push(task);
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
