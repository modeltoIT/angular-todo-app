import { Component, OnInit } from '@angular/core';
import { AddTodoFormComponent } from "../add-todo-form/add-todo-form.component";
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { AsyncPipe, NgForOf } from "@angular/common";
import { NumOfActiveTitlePipe } from "../../pipes/num-of-active-title.pipe";
import { TodoComponent } from "../todo/todo.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../../type/todo';
import { TodosService } from '../../services/todos.service';
import { ErrorService } from '../../services/error.service';
import { first, forkJoin, map, Observable, switchMap } from 'rxjs';
import { FilterComponent } from '../filter/filter.component';
import { ActivatedRoute } from '@angular/router';
import { RouteParam } from '../../type/route-param';

@Component({
  selector: 'app-todos-page',
  imports: [
    AddTodoFormComponent,
    ErrorMessageComponent,
    NgForOf,
    NumOfActiveTitlePipe,
    TodoComponent,
    AsyncPipe,
    FilterComponent
  ],
  templateUrl: './todos-page.component.html',
})
export class TodosPageComponent implements OnInit{
  todoForm = new FormGroup({
    title: new FormControl('', Validators.required)
  })

  todos$: Observable<Todo[]>;
  activeTodos$: Observable<Todo[]>;
  countActiveTodos$: Observable<number>;
  completedTodos$: Observable<Todo[]>;
  visible$: Observable<Todo[]>;

  constructor(
    private todosService: TodosService,
    private messageService: ErrorService,
    private route: ActivatedRoute
  ) {
    this.todos$ = this.todosService.todos$;
    this.activeTodos$ = this.todos$.pipe(
      map(todos => todos.filter(todo => !todo.completed)),
    );

    this.countActiveTodos$ = this.activeTodos$.pipe(
      map(activeTodos => activeTodos.length)
    )

    this.completedTodos$ = this.todos$.pipe(
      map(todos => todos.filter(todo => todo.completed))
    );

    this.visible$ = this.route.params.pipe(
      switchMap((param) => {
        switch(param['status'] as RouteParam) {
          case "active":
            return this.activeTodos$;
          case "completed":
            return this.completedTodos$;
          default:
            return this.todos$;
        }
        }
      )
    )
  }

  ngOnInit() {
    this.todosService.getTodos().subscribe({
      error: () => this.messageService.showMessage('Unable to load todos'),
    });
  }

  handleDelete(todo: Todo) {
    this.todosService.deleteTodo(todo).subscribe({
      error: () => this.messageService.showMessage('Unable to delete todo')
    })

    return this.todosService.deleteTodo(todo);
  }

  updateTitle(todo: Todo, title: string) {
    this.todosService.changeTodo({...todo, title}).subscribe({
      error: () => this.messageService.showMessage('Unable to change todo\'s title')
    })
  }

  toggleStatus(todo: Todo) {
    this.todosService.changeTodo({...todo, completed: !todo.completed}).subscribe(
      {
        error: () => this.messageService.showMessage('Unable to change todo status')
      }
    )
  }

  handleFormSubmit() {
    if (!this.title.value.trim()) return;

    this.addTodo(this.title.value.trim() );
    this.title.reset();
  }

  addTodo(title: string) {
    this.todosService.createTodo(title).subscribe({
      error: () => this.messageService.showMessage('Unable to add todo')
    })
  }

  get title() {
    return this.todoForm.get('title') as FormControl;
  }

  trackByID(_: number, todo: Todo) {
    return todo.id;
  }

  clearCompleted() {
    this.completedTodos$.pipe(
      first(),
      switchMap(todos => forkJoin(todos.map((todo) => this.todosService.deleteTodo(todo))))
    ).subscribe({
      error: () => this.messageService.showMessage('Unable to clear completed todos')
    });
  }
}
