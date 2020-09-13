import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  links: NodeListOf<Element>;
  linkTheme = document.querySelector('#theme');

  constructor() {
    // href="./assets/css/colors/default-dark.css"
    const url = JSON.parse(localStorage.getItem('colorTheme')) || './assets/css/colors/default-dark.css';
    this.linkTheme.setAttribute('href', url);
    console.log('Settings Service init!');
  }

  changeTheme(theme: string) {
    const url = `./assets/css/colors/${theme}.css`;

    this.linkTheme.setAttribute('href', url);
    localStorage.setItem('colorTheme', JSON.stringify(url));
    this.checkCurrentTheme();
  }

  checkCurrentTheme() {
    const links = document.querySelectorAll('.selector');
    links.forEach(element => {
      element.classList.remove('working');
      const btnTheme = element.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme.getAttribute('href');

      if (btnThemeUrl === currentTheme) {
        element.classList.add('working');
      }
    })
  }
}
