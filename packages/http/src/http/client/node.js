/**
 * Http client (Node).
 */

import Promise from '../../promise';
import { each, trim } from '../../util';

export default function (request) {

    const client = require('got');

    return new Promise((resolve) => {

        const url = request.getUrl();
        const body = request.getBody();
        const method = request.method;
        const headers = {}; let
            handler;

        request.headers.forEach((value, name) => {
            headers[name] = value;
        });

        client(url, { body, method, headers }).then(handler = (resp) => {

            const response = request.respondWith(resp.body, {
                status: resp.statusCode,
                statusText: trim(resp.statusMessage)
            });

            each(resp.headers, (value, name) => {
                response.headers.set(name, value);
            });

            resolve(response);

        }, error => handler(error.response));
    });
}
