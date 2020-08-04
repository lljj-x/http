/**
 * Base client.
 */

import Promise from '../../promise';
import xhrClient from './xhr';
// import nodeClient from './node';
import {
    warn, when, isObject, isFunction
} from '../../util';
import sendAfter from '../interceptor/sendAfter';

export default function (context) {

    // 拦截器队列，初始化的即为当前的请求
    const reqHandlers = [sendRequest]; const
        resHandlers = [];

    if (!isObject(context)) {
        context = null;
    }

    function Client(request) {
        while (reqHandlers.length) {

            // 弹出所有的拦截器，先进后出 顺序如下
            // [sendRequest, ... 系统初始化的那几个拦截器，...用户手动push的拦截器]
            const handler = reqHandlers.pop();

            if (isFunction(handler)) {

                let response; let
                    next;

                // 依次自行拦截器的request 返回 response
                // 改变当前 request.client 都是在系统拦截器request执行做的操作
                response = handler.call(context, request, val => next = val) || next;

                // response 是否为Object
                // 这里isObject 的 handler 实际是等于初始化的第一个拦截器 sendRequest ，只有sendRequest 才返回一个自定义的包含context 的promise对象
                if (isObject(response)) {
                    return new Promise((resolve, reject) => {

                        // 依次执行 response ，Promise return promise 的结构
                        // 接口调用client(request)-> 拦截器res[0] -> 拦截器res[1]
                        resHandlers.forEach((handler) => {
                            response = when(response, response => handler.call(context, response) || response, reject);
                        });

                        // 接口调用和拦截器都执行完，请求 resolve or reject
                        when(response, resolve, reject);

                    }, context);
                }

                // response 是否为 function，用户配置的都是function 或者没有 return
                // req最后一个先弹出，新执行，res 却依次往前追加
                // 所以这里会导致拦截器中的 request 后面的先执行，而response 却前面的先执行 ...
                if (isFunction(response)) {
                    resHandlers.unshift(response);
                }

            } else {
                warn(`Invalid interceptor of type ${typeof handler}, must be a function`);
            }
        }
    }

    Client.use = (handler) => {
        reqHandlers.push(handler);
    };

    return Client;
}

// 拦截器队列初始值为接口调用
function sendRequest(request) {
    // const client = request.client || (inBrowser ? xhrClient : nodeClient);
    const client = request.client || xhrClient;

    const res = client(request);

    // 这里才会注入对应 client 的abort 方法
    sendRequestAfter(request);
    return res;
}

// 添加该方法 实现取消当前请求的能力
function sendRequestAfter(request) {
    // request.abort();
    // 不兼容 vue 的this了
    sendAfter.call(null, request);
}
