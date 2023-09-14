import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  animations: [
    trigger('dropdownState', [
      state('show', style({ opacity: 1, height: '*' })),
      state('hide', style({ opacity: 0, height: '0px' })),
      transition('show <=> hide', animate('300ms ease-in-out'))
    ])
  ]
})
export class SideMenuComponent {
  openDropdowns: string[] = [];

  isDropdownOpen(dropdownKey: string): boolean {
    return this.openDropdowns.includes(dropdownKey);
  }

  toggleDropdown(dropdownKey: string): void {
    if (this.isDropdownOpen(dropdownKey)) {
      this.openDropdowns = this.openDropdowns.filter(key => key !== dropdownKey);
    } else {
      this.openDropdowns.push(dropdownKey);
    }
  }
}