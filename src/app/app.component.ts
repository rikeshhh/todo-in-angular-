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
}
