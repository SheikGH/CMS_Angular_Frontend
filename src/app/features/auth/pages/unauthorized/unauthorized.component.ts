import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [],
  //templateUrl: './unauthorized.component.html',
  template: `<h2>Unauthorized Access</h2><p>You do not have permission to view this page.</p>`,
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

}
