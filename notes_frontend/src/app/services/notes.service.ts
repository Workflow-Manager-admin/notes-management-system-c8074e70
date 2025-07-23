import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Note {
  id?: number;
  title: string;
  body: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private http = inject(HttpClient);
  // Backend base API, to be replaced/configured
  private api = '/api/notes';

  // PUBLIC_INTERFACE
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.api}/`);
  }

  // PUBLIC_INTERFACE
  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.api}/${id}`);
  }

  // PUBLIC_INTERFACE
  createNote(note: Note): Observable<Note> {
    return this.http.post<Note>(`${this.api}/`, note);
  }

  // PUBLIC_INTERFACE
  updateNote(id: number, note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.api}/${id}`, note);
  }

  // PUBLIC_INTERFACE
  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
