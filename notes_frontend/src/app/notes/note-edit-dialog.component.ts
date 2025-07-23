import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotesService, Note } from '../services/notes.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-note-edit-dialog',
  templateUrl: './note-edit-dialog.component.html',
  styleUrls: ['./note-edit-dialog.css']
})
export class NoteEditDialogComponent {
  mode: 'create' | 'edit';
  form;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private notesService: NotesService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<NoteEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {mode: 'create'|'edit', note?: Note}
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
    this.mode = data.mode;
    if (data.note) this.form.patchValue(data.note);
  }

  // PUBLIC_INTERFACE
  submit(): void {
    if (this.form.invalid) return;
    const payload = this.form.value as { title: string; body: string };
    this.loading = true;
    if (this.mode === 'create') {
      this.notesService.createNote(payload as Note).subscribe({
        next: () => {
          this.snack.open('Note created', 'Close', { duration: 1500 });
          this.dialogRef.close('success');
        },
        error: () => {
          this.snack.open('Create failed', 'Close', { duration: 2000, panelClass: 'error' });
          this.loading = false;
        }
      });
    } else if (this.mode === 'edit' && this.data.note) {
      this.notesService.updateNote(this.data.note.id!, payload as Note).subscribe({
        next: () => {
          this.snack.open('Note updated', 'Close', { duration: 1500 });
          this.dialogRef.close('success');
        },
        error: () => {
          this.snack.open('Update failed', 'Close', { duration: 2000, panelClass: 'error' });
          this.loading = false;
        }
      });
    }
  }

  // PUBLIC_INTERFACE
  close(): void {
    this.dialogRef.close();
  }
}
