import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-example-home',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './example-home.html',
  styleUrl: './example-home.css',
})
export class ExampleHome {}
