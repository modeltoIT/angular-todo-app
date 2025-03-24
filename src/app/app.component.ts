import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoComponent } from './components/todo/todo.component';
import { Todo } from './type/todo';
import { ChangeTodoProps } from './type/change-todo-props';
import { AddTodoFormComponent } from './components/add-todo-form/add-todo-form.component';
import { FilterActivePipe } from './pipes/filter-active.pipe';
import { NumOfActiveTitlePipe } from './pipes/num-of-active-title.pipe';
import { TodosService } from './services/todos.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, TodoComponent, AddTodoFormComponent, FilterActivePipe, NumOfActiveTitlePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  isActive = false;
  todoForm = new FormGroup({
    title: new FormControl('', Validators.required)
  })

  todos: Todo[] = [];

  constructor(private todosService: TodosService) {
  }

  ngOnInit() {
    this.todosService.todos$.subscribe((todos) => {
      this.todos = todos;
    })
  }

  handleDelete(todo: Todo) {
    this.todosService.deleteTodo(todo).subscribe()
  }

  updateTitle(todo: Todo, title: string) {
    this.todosService.changeTodo({...todo, title}).subscribe()
  }

  toggleStatus(todo: Todo) {
    this.todosService.changeTodo({...todo, completed: !todo.completed}).subscribe()
  }

  handleFormSubmit() {
    if (!this.title.value.trim()) return;

    this.addTodo(this.title.value.trim() );
    this.title.reset();
  }

  addTodo(title: string) {
    this.todosService.createTodo(title).subscribe()
  }

  get title() {
    return this.todoForm.get('title') as FormControl;
  }

  trackByID(id: number, todo: Todo) {
    return todo.id;
  }

  protected readonly indexedDB = indexedDB;
}
