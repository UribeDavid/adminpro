import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;

  public registerForm = this.formBuilder.group({
    nombre: [ null, [ Validators.required, Validators.minLength(3) ]],
    email: [ null, [ Validators.required, Validators.email ]],
    password: [ null, [ Validators.required ]],
    password2: [ null, [ Validators.required ]],
    terminos: [ false, [ Validators.required ]],
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor( private formBuilder: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router ) { }

  ngOnInit(): void {
  }

  crearUsuario() {
    this.formSubmitted = true;

    if ( this.registerForm.invalid ) return;

    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(
      (response: any) => {
        this.router.navigateByUrl('/');
      }, err => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  campoNoValido( campo: string ): boolean {
    return !this.registerForm.get(campo).valid && this.formSubmitted ? true : false;
  }

  invalidPasswords() {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    (pass1 !== pass2) && this.formSubmitted ? false : true;
  }

  passwordsIguales(pass1: string, pass2: string) {

    return (formGroup: FormGroup) => {

      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      pass1Control.value === pass2Control.value
      ? pass2Control.setErrors(null)
      : pass2Control.setErrors({ noEsIgual: false })
    }
  }

}
