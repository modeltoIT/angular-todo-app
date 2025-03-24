import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { Form, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-add-todo-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-todo-form.component.html',
  styleUrl: './add-todo-form.component.scss'
})
export class AddTodoFormComponent {
  @Input() todoForm!: FormGroup;
  @Output() submitForm = new EventEmitter();

  submit() {
    this.submitForm.emit();
  }
}
