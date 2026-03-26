import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // if the user is authenticated, allow access to the route, see app.routes.ts for more details with canActivate
    if(authService.isAuthenticated())
        return true;

    // if the user is not authenticated, redirect to the login page. also see https://angular.dev/guide/routing/route-guards#types-of-route-guards
    const loginPath = router.parseUrl("/login");
    return new RedirectCommand(loginPath);
    
}