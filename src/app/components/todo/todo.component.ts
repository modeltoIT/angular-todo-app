import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { Todo } from '../../type/todo';

@Component({
  selector: 'app-todo',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './todo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  @Input() todo!: Todo;
  @Input() todoForm!: FormGroup;
  @Output() updateTitle = new EventEmitter<string>();
  @Output() toggleStatus = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<Todo>();

  editing = false;
  title: string = '';

  @ViewChild("titleField") set titleField(field: ElementRef) {
    if (!this.editing) return;

    field?.nativeElement.focus();
  }

  handleToggleStatus() {
    this.toggleStatus.emit();
  }

  removeTodo() {
    this.delete.emit(this.todo);
  }

  edit() {
    this.editing = true;
  }

  save() {
    this.editing = false;
  }

  changeTitle(event: Event) {
    const input = event.target as HTMLInputElement;

    this.title = input.value;
  }

  submitTitle() {
    if (this.editing && (this.title && this.title.trim() || this.todo.title !== this.title)) {
      this.updateTitle.emit(this.title)
    }

    this.save();
  }
}
