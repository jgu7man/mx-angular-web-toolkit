import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Provides the location origin (domain) of the application.
 * Solution taken from
 * @link https://stackoverflow.com/a/66858594/10906012
 *
 * @type {string}
 */
@Injectable({
  providedIn: 'root'
})
export class MxLocationService {
  hostname: string;
  protocol: string;
  pathname: string;
  hash: string;

  constructor(private router: Router, private location: Location) {
    this.hostname = this.router['location']._platformLocation.hostname;
    this.protocol = this.router['location']._platformLocation.protocol;
    this.pathname = this.router['location']._platformLocation.pathname;
    this.hash = this.router['location']._platformLocation.hash;
  }

  /**
   * Provides the whole location (included domain) of the current location.
   *
   * @readonly
   * @type {string}
   */
  get href(): string {
    const url = `${this.protocol}://${this.hostname}${this.pathname}${this.hash}`;
    return url;
  }

  reload() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}

/* 
ServerPlatformLocation {
  href: 'http://localhost:64965/',
  hostname: 'localhost',
  protocol: 'http:',
  port: '64965',
  pathname: '/',
  search: '',
  hash: '',
}
*/
