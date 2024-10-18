import { Component } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css',
  standalone: true,
  imports: [MatButtonToggle, MatButtonToggleGroup],
})
export class GoalsComponent {

}
