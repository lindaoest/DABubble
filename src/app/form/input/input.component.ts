import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {

  @Input()
  public icon!: string;

  @Input()
  public type!: string;

  @Input()
  public placeholder!: string;

  @Input()
  public control!: any;

  @Input()
  public minLength: number = 0;
}
