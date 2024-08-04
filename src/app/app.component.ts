import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class AppComponent implements OnInit {
  title = 'todo-app';
  todos: any[] = [];
  newTodo = '';
  editTodoId: number | null = null;
  editTodoText: string = '';

  private apiUrl = 'http://localhost:3000/todos';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTodos();
  }

  fetchTodos() {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => {
      this.todos = data;
    });
  }

  deleteTodo(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    });
  }

  addTodo() {
    if (this.newTodo.trim().length === 0) {
      return;
    }
    const newTodo = {
      text: this.newTodo,
      completed: false,
      timestamp: new Date(),
    };
    this.http.post<any>(this.apiUrl, newTodo).subscribe((data) => {
      this.todos.push(data);
      this.newTodo = '';
    });
  }

  enableEdit(todo: any) {
    this.editTodoId = todo.id;
    this.editTodoText = todo.text;
  }

  saveEdit(todo: any) {
    if (this.editTodoText.trim().length === 0) {
      return;
    }
    const updatedTodo = { ...todo, text: this.editTodoText };
    this.http
      .put<any>(`${this.apiUrl}/${todo.id}`, updatedTodo)
      .subscribe((data) => {
        const index = this.todos.findIndex((t) => t.id === todo.id);
        this.todos[index] = data;
        this.editTodoId = null;
        this.editTodoText = '';
      });
  }

  cancelEdit() {
    this.editTodoId = null;
    this.editTodoText = '';
  }
}
