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
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogContent, MatDialogModule } from '@angular/material/dialog';

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
  imports: [CommonModule, FormsModule, MatDialogModule, MatDialogContent, ReactiveFormsModule, MatListModule, MatButtonModule, MatIconModule, MatMenuModule, MatButtonToggle, MatButtonToggleGroup]
})

export class NotesComponent {
  dataSource = new MatTableDataSource<Notebook>();
  selectedNotebook: Notebook | null = null;
  contentControl = new FormControl();
  inputControl = new FormControl();

  constructor(private dialog: MatDialog) {
    this.inputControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.detectChangesAndSave();
      });

    this.contentControl.valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.detectChangesAndSave();
      });
  }

  ngOnInit() {
    let local = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('notes/')) {
        const value = localStorage.getItem(key);
        local.push(JSON.parse(value || '{}'));
      }
    }

    if (local) {

      this.dataSource.data = local;
    }
    else {
      this.dataSource.data = [];
    }

    this.dataSource._updateChangeSubscription();
  }

  detectChangesAndSave() {
    if (this.selectedNotebook == null) {
      return;
    }

    const content = document.getElementById("content") as HTMLTextAreaElement;
    const title = document.getElementById("title") as HTMLInputElement;

    const notebook: Notebook = {
      id: this.selectedNotebook!.id,
      createdAt: this.selectedNotebook!.createdAt,
      title: title.value,
      content: content.value!,
      modifiedAt: new Date()
    }

    const savedNotebook = JSON.parse(localStorage.getItem("notes/" + notebook.id) || '{}');
    if (savedNotebook.content == notebook.content && savedNotebook.title == notebook.title) {
      return;
    }

    const i = this.dataSource.data.findIndex(item => item.id == notebook.id);
    this.dataSource.data[i] = notebook;
    this.dataSource._updateChangeSubscription();

    this.saveNotebook(notebook);
  }

  selectNotebook(notebook: Notebook | null) {
    this.detectChangesAndSave();
    this.selectedNotebook = notebook;
    if (notebook == null) {
      return;
    }

    this.inputControl.setValue(notebook?.title || '');
    this.contentControl.setValue(notebook?.content || ''); 
  }

  addNotebook() {
    const notebook: Notebook = { id: UUIDService.generateUUID(), title: 'New Notebook', content: '', createdAt: new Date(), modifiedAt: new Date() };
    this.dataSource.data.push(notebook);
    this.dataSource._updateChangeSubscription();

    this.saveNotebook(notebook);
  }

  deleteNotebook() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: this.selectedNotebook?.title } });
    dialogRef.afterClosed().subscribe(result => {

      if (result == "confirm") {
        const i = this.dataSource.data.findIndex(item => item.id == this.selectedNotebook?.id);
        this.dataSource.data.splice(i, 1);
        this.dataSource._updateChangeSubscription();

        localStorage.removeItem("notes/" + this.selectedNotebook?.id);
        this.selectNotebook(null);
      }
    });
  }

  saveNotebook(notebook: Notebook) {
    localStorage.setItem("notes/" + notebook.id, JSON.stringify(notebook));
    this.selectNotebook(notebook);
  }
}
