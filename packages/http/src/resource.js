/**
 * Service for interacting with RESTful services.
 */

import Http from './http/index';
import { assign, each, merge } from './util';

export default function Resource(url, params, actions, options) {

    const self = this || {}; const
        resource = {};

    actions = assign({},
        Resource.actions,
        actions);

    each(actions, (action, name) => {

        action = merge({ url, params: assign({}, params) }, options, action);

        resource[name] = function () {
            return (self.$http || Http)(opts(action, arguments)); // eslint-disable-line
        };
    });

    return resource;
}

function opts(action, args) {

    const options = assign({}, action); let params = {}; let
        body;

    switch (args.length) {

    case 2:

        params = args[0];
        body = args[1];

        break;

    case 1:

        if (/^(POST|PUT|PATCH)$/i.test(options.method)) {
            body = args[0];
        } else {
            params = args[0];
        }

        break;

    case 0:

        break;

    default:

        throw `Expected up to 2 arguments [params, body], got ${args.length} arguments`; // eslint-disable-line
    }

    options.body = body;
    options.params = assign({}, options.params, params);

    return options;
}

Resource.actions = {

    get: { method: 'GET' },
    save: { method: 'POST' },
    query: { method: 'GET' },
    update: { method: 'PUT' },
    remove: { method: 'DELETE' },
    delete: { method: 'DELETE' }

};
