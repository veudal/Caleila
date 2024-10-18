import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input'
import { UUIDService } from '../services/uuid.service';
import { CommonModule } from '@angular/common';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css'],
  standalone: true,
  imports: [MatCheckboxModule, CommonModule, FormsModule, MatTableModule, MatIconModule, MatButtonModule, MatFormField, MatLabel, MatInput]
})
export class ToDoComponent implements OnInit {
  displayedColumns: string[] = ['completed', 'task', 'delete'];

  dataSource = new MatTableDataSource<Task>();

  ngOnInit() {
    const local = localStorage.getItem("to-do");
    if (local) {
      this.dataSource.data = JSON.parse(local); 
    }
  }

  onDescriptionChange() {
    localStorage.setItem("to-do", JSON.stringify(this.dataSource.data));
  }

  onToggleCompleted() {
    localStorage.setItem("to-do", JSON.stringify(this.dataSource.data));
  }

  deleteTask(task: Task) {
    this.dataSource.data = this.dataSource.data.filter(item => item.id !== task.id);
    localStorage.setItem("to-do", JSON.stringify(this.dataSource.data));
  }

  addTask() {
    const task: Task = { description: '', completed: false, id: UUIDService.generateUUID() };
    this.dataSource.data.unshift(task);
    this.dataSource._updateChangeSubscription();

    localStorage.setItem("to-do", JSON.stringify(this.dataSource.data));
  }
}
