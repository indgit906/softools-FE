import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // const token = localStorage.getItem('token');

  // const newReq = token
  //   ? req.clone({
  //       setHeaders: { Authorization: `Bearer ${token}` },
  //     })
  //   : req;
  // //debugger;
  // return next(newReq);
  return next(req);
};
