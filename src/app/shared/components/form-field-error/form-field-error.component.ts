import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: AbstractControl | null;
  @Input('error-message') errorMessageEnv: string;


  constructor() { }

  ngOnInit(){

  }

  public get errorMessage(): string | null {
    
    if(this.mustShowMessageError())
      return this.getErrorMessage();
    else
      return null;
  }

  private mustShowMessageError(): boolean {
    return this.formControl ? this.formControl.invalid && this.formControl.touched : false;
  }

  private getErrorMessage(): string | null {
    if(this.formControl?.errors?.['required'])
      return this.errorMessageEnv;

    else if(this.formControl?.errors?.['minlength']) {
      const requiredLength = this.formControl?.errors?.['minlength']?.requiredLength;

      return `deve ter no mínimo ${requiredLength} caracteres`;
    }

    return null;
  }
}
