/**
 * Service for sending network requests.
 */

import cors from './interceptor/cors';
import form from './interceptor/form';
import json from './interceptor/json';
import jsonp from './interceptor/jsonp';
import before from './interceptor/before';
import method from './interceptor/method';
import header from './interceptor/header';
import Client from './client/index';
import Request from './request';
import Promise from '../promise';
import CancelToken from './canel/CancelToken';

import {
    assign, defaults, error, isString, isFunction
} from '../util';

const COMMON_HEADERS = { Accept: 'application/json, text/plain, */*' };
const JSON_CONTENT_TYPE = { 'Content-Type': 'application/json;charset=utf-8' };

export default function Http(options) {
    // bind 当前this
    const self = this || {}; const
        client = Client(self.$vm);

    defaults(options || {}, self.$options, Http.options);

    // interceptors use 到当前的请求
    Http.interceptors.forEach((handler) => {

        // 系统默认的拦截器，通过配置可以重置，比如更换jsonp的实现可以通过此操作
        if (isString(handler)) {
            handler = Http.interceptor[handler];
        }

        if (isFunction(handler)) {
            client.use(handler);
        }

    });

    return client(new Request(options)).then(response => (response.ok ? response : Promise.reject(response)), (response) => {

        if (response instanceof Error) {
            error(response);
        }

        return Promise.reject(response);
    });
}

Http.options = {};

Http.headers = {
    put: JSON_CONTENT_TYPE,
    post: JSON_CONTENT_TYPE,
    patch: JSON_CONTENT_TYPE,
    delete: JSON_CONTENT_TYPE,
    common: COMMON_HEADERS,
    custom: {}
};

Http.CancelToken = CancelToken;

Http.interceptor = {
    before, method, jsonp, json, form, header, cors
};
Http.interceptors = ['before', 'method', 'jsonp', 'json', 'form', 'header', 'cors'];

['get', 'delete', 'head', 'jsonp'].forEach((itemMethod) => {

    Http[itemMethod] = function (url, options) {
        return this(assign(options || {}, { url, itemMethod }));
    };
});

['post', 'put', 'patch'].forEach((itemMethod) => {

    Http[itemMethod] = function (url, body, options) {
        return this(assign(options || {}, { url, itemMethod, body }));
    };

});
