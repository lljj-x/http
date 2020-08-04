/**
 * After Interceptor.
 */

// 添加sendAfter，取消方法只有在 send 之后调用
import { isFunction } from '../../util';

export default function (request) {
    // token 方式取消
    if (request.cancelToken) {
        request.cancelToken.promise.then(() => {
            // 取消请求
            request.abort();
        });
    }

    // send后，这里可以获取到请求后的 request 方法，也可以在这里取消请求
    if (isFunction(request.sendAfter)) {
        request.sendAfter.call(this, request);
    }
}
