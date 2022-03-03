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
  @Input('error-messages') errorMessages: {required?: string, minLength?: string} | null;


  constructor() { }

  ngOnInit(){

  }

  public get errorMessage(): string | undefined {
    
    if(this.mustShowMessageError())
      return this.getErrorMessage();
    else
      return undefined;
  }

  private mustShowMessageError(): boolean {
    return this.formControl ? this.formControl.invalid && this.formControl.touched : false;
  }

  private getErrorMessage(): string | undefined {
    if(this.formControl?.errors?.['required'])
      return this.errorMessages?.required;

    else if(this.formControl?.errors?.['minlength'])
      return this.errorMessages?.minLength;

    return undefined;
  }
}
