import { Injectable } from '@angular/core';
import { Todo } from '../type/todo';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, withLatestFrom } from 'rxjs';

const USER_ID = 1517;
const BASE_URL = "https://mate.academy/students-api";

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private refresh$$ = new BehaviorSubject<Todo[]>([]);

  todos$ = this.refresh$$.asObservable();


  constructor(private http: HttpClient) {
  }

  getTodos() {
    return this.http.get<Todo[]>(BASE_URL + `/todos?userId=${ USER_ID }`).pipe(
      tap((todos) => this.refresh$$.next(todos))
    )
  }

  createTodo(title: string) {
    return this.http.post<Todo>(BASE_URL + '/todos', {
      userId: USER_ID,
      title,
      completed: false,
    }).pipe(
      withLatestFrom(this.todos$),
      tap(([todo, todos]) => {
        this.refresh$$.next([...todos, todo])
      })
    )
  }

  changeTodo(todo: Todo) {
    return this.http.patch<Todo>(BASE_URL + '/todos/' + todo.id, todo).pipe(
      withLatestFrom(this.todos$),
      tap(([updatedTodo, todos]) => {
        this.refresh$$.next(
          todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
        )
      })
    )
  }

  deleteTodo(todo: Todo) {
    return this.http.delete(BASE_URL + '/todos/' + todo.id).pipe(
      withLatestFrom(this.todos$),
      tap(([_,todos]) => this.refresh$$.next(
        todos.filter(t => t.id !== todo.id)
      ))
    )
  }
}
