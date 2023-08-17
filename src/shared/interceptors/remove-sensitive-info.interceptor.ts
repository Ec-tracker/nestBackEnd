import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { map } from 'rxjs';

@Injectable()
export class RemoveSensitiveUserInfoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    // const request = context.switchToHttp().getRequest();
    // console.log('request', request);
    return next.handle().pipe(
      // 统一应答实现
      map((res) => {
        if (res) {
          res = JSON.parse(JSON.stringify(res));
          this.delVale(res, 'name');
          this.delVale(res, 'salt');
        }
        console.log('res1', res);
        return {
          code: 200,
          result: res,
        };
      }),
    );
  }

  delVale(data, field) {
    for (let key in data) {
      if (key === field) {
        delete data[field];
      } else if (typeof data[key] === 'object') {
        this.delVale(data[key], field);
      }
    }
  }
}
