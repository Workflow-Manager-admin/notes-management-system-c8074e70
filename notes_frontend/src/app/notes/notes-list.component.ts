import { Component, OnInit } from '@angular/core';
import { NotesService, Note } from '../services/notes.service';
import { MatDialog } from '@angular/material/dialog';
import { NoteEditDialogComponent } from './note-edit-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.css']
})
export class NotesListComponent implements OnInit {
  notes: Note[] = [];
  loading = false;
  error = '';

  selectedNote: Note | null = null;

  constructor(
    private notesService: NotesService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchNotes();
  }

  // PUBLIC_INTERFACE
  fetchNotes(): void {
    this.loading = true;
    this.notesService.getNotes().subscribe({
      next: (notes: Note[]) => {
        this.notes = notes;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load notes';
        this.loading = false;
      }
    });
  }

  // PUBLIC_INTERFACE
  selectNote(note: Note): void {
    this.selectedNote = note;
  }

  // PUBLIC_INTERFACE
  openCreateDialog(): void {
    const dlg = this.dialog.open(NoteEditDialogComponent, {
      width: '400px',
      data: { mode: 'create' }
    });
    dlg.afterClosed().subscribe((res: any) => {
      if (res === 'success') this.fetchNotes();
    });
  }

  // PUBLIC_INTERFACE
  openEditDialog(note: Note): void {
    const dlg = this.dialog.open(NoteEditDialogComponent, {
      width: '400px',
      data: { mode: 'edit', note }
    });
    dlg.afterClosed().subscribe((res: any) => {
      if (res === 'success') this.fetchNotes();
    });
  }

  // PUBLIC_INTERFACE
  deleteNote(note: Note): void {
    let shouldDelete = true;
    if (typeof globalThis !== 'undefined' && typeof globalThis.confirm === 'function') {
      shouldDelete = globalThis.confirm(`Delete note "${note.title}"?`);
    }
    if (!shouldDelete) return;
    this.notesService.deleteNote(note.id!).subscribe({
      next: () => {
        this.snack.open('Note deleted', 'Close', { duration: 1700 });
        this.fetchNotes();
      },
      error: () => {
        this.snack.open('Delete failed', 'Close', { duration: 2500, panelClass: 'error' });
      }
    });
  }
}
