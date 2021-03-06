/**
 * Root Prefix Transform.
 */

import { isString, trimEnd } from '../util';

export default function (options, next) {

    let url = next(options);

    if (isString(options.root) && !/^(https?:)?\//.test(url)) {
        url = `${trimEnd(options.root, '/')}/${url}`;
    }

    return url;
}
