import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

// This interceptor adds the JWT token to the Authorization header of outgoing HTTP requests if the user is authenticated.
// this should be added in the app.config.ts along with http client provider as shown in the app.config.ts file.
// interceptors are available from angular 15 onwards and are a more functional approach to intercepting HTTP requests compared to the traditional class-based interceptors. see this :https://justangular.com/blog/migrate-angular-interceptors-to-function-based-interceptors    
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService); 
    const token = authService.getToken();

    if(token){
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req);
}