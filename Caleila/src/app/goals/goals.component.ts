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
  imports: [MatButtonToggle, MatButtonToggleGroup, MatCheckboxModule, CommonModule, FormsModule, MatTableModule, MatIconModule, MatButtonModule, MatFormField, MatLabel, MatInput]
})

export class GoalsComponent implements OnInit {
  displayedColumns: string[] = ['index', 'completed', 'goal', 'delete'];
  name = "monthly-goals";
  dataSource = new MatTableDataSource<Goal>();

  ngOnInit() {
    this.loadGoals();
  }

  private loadGoals() {
    const local = localStorage.getItem(this.name);
    if (local) {
      this.dataSource.data = JSON.parse(local);
    }
    else {
      this.dataSource.data = [];
    }

    this.dataSource._updateChangeSubscription();
  }

  onToggleButtonGroup(event: MatButtonToggleChange) {
    this.name = event.value + "-goals";
    this.loadGoals();
    console.log(this.name);
  }

  onDescriptionChange() {
    localStorage.setItem(this.name, JSON.stringify(this.dataSource.data));
  }

  onToggleCompleted() {
    localStorage.setItem(this.name, JSON.stringify(this.dataSource.data));
  }

  deleteGoal(task: Goal) {
    this.dataSource.data = this.dataSource.data.filter(item => item.id !== task.id);
    localStorage.setItem(this.name, JSON.stringify(this.dataSource.data));
  }

  addGoal() {
    const task: Goal = { description: '', completed: false, id: UUIDService.generateUUID() };
    this.dataSource.data.push(task);
    this.dataSource._updateChangeSubscription();

    localStorage.setItem(this.name, JSON.stringify(this.dataSource.data));
  }
}
