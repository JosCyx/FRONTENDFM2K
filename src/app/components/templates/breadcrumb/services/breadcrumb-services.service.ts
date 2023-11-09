import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbServicesService  {
  private breadcrumbsSubject = new BehaviorSubject<any[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();
  private breadcrumbs: any[] = [];
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // this.breadcrumbsSubject.next(this.createBreadcrumbs(this.activatedRoute.root));
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
        this.breadcrumbsSubject.next(this.breadcrumbs);
      }
    });
  }
  createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any[] {
    
    const children: ActivatedRoute[] = route.children;
    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      breadcrumbs.push({ label: child.snapshot.data['breadcrumb'], url: url });
      this.createBreadcrumbs(child, url, breadcrumbs);
      console.log("Breadcrumbs ",breadcrumbs)
    }

    return breadcrumbs;
  }
  getBreadcrumbs(): any[] {
    console.log("Cambios ",this.breadcrumbs)
    return this.breadcrumbs;
  }
}
