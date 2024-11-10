import { Component } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    protected readonly authService: AuthenticationService,
    protected readonly location: Location,
    protected readonly router: Router
  ) {}
}
