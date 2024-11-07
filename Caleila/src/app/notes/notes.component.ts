import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UUIDService } from '../services/uuid.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';

export interface Notebook {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatListModule, MatButtonModule, MatIconModule, MatMenuModule, MatButtonToggle, MatButtonToggleGroup]
})

export class NotesComponent {
  dataSource = new MatTableDataSource<Notebook>();
  selectedNotebook: Notebook | null = null;
  notebookContent: string = '';
  inputControl = new FormControl();
  initialLoad = true;

  constructor() {
    this.inputControl.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe(value => {
        //not working as intended:
        //alert(value);
        this.saveNotebook(value);
      });
  }

  ngOnInit() {
    const local = localStorage.getItem("notes");
    if (local) {
      this.dataSource.data = JSON.parse(local);
    }
    else {
      this.dataSource.data = [];
    }

    this.dataSource._updateChangeSubscription();
  }

  saveNotebook(value: string) {
    const content = document.getElementById("content") as HTMLTextAreaElement;
    const title = document.getElementById("title") as HTMLInputElement;


    const notebook: Notebook = {
      id: this.selectedNotebook!.id,
      createdAt: this.selectedNotebook!.createdAt,
      title: title.value,
      content: content.value!,
      modifiedAt: new Date()
    }

    const i = this.dataSource.data.findIndex(item => item.id == notebook.id);
    this.dataSource.data[i] = notebook;
    this.dataSource._updateChangeSubscription();
    localStorage.setItem("notes", JSON.stringify(this.dataSource.data));
    this.selectNotebook(notebook);
  }

  selectNotebook(notebook: Notebook) {
    this.selectedNotebook = notebook;
    const title = document.getElementById("title") as HTMLInputElement;
    title.value = notebook.title;

    const content = document.getElementById("content") as HTMLTextAreaElement;
    content.value = notebook.content;
  }

  addNotebook() {
    const notebook: Notebook = { id: UUIDService.generateUUID(), title: 'New Notebook', content: '', createdAt: new Date(), modifiedAt: new Date() };
    this.dataSource.data.push(notebook);
    this.dataSource._updateChangeSubscription();

    localStorage.setItem("notes", JSON.stringify(this.dataSource.data));

    this.selectNotebook(notebook);
  }
}
