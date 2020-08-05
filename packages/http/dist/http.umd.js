/** @license @lljj/http (c) 2020-2020 Liu.Jun License: MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.http = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * Promise adapter.
   */
  // import PromiseLib from './lib/promise';
  //
  // if (typeof Promise === 'undefined') {
  //     window.Promise = PromiseLib;
  // }
  // 封装 promise 加上context 来解决在vue 实例中this指向问题
  function PromiseObj(executor, context) {
    if (executor instanceof Promise) {
      this.promise = executor;
    } else {
      this.promise = new Promise(executor.bind(context));
    }

    this.context = context;
  }

  PromiseObj.all = function (iterable, context) {
    return new PromiseObj(Promise.all(iterable), context);
  };

  PromiseObj.resolve = function (value, context) {
    return new PromiseObj(Promise.resolve(value), context);
  };

  PromiseObj.reject = function (reason, context) {
    return new PromiseObj(Promise.reject(reason), context);
  };

  PromiseObj.race = function (iterable, context) {
    return new PromiseObj(Promise.race(iterable), context);
  };

  var p = PromiseObj.prototype;

  p.bind = function (context) {
    this.context = context;
    return this;
  };

  p.then = function (fulfilled, rejected) {
    if (fulfilled && fulfilled.bind && this.context) {
      fulfilled = fulfilled.bind(this.context);
    }

    if (rejected && rejected.bind && this.context) {
      rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.then(fulfilled, rejected), this.context);
  };

  p.catch = function (rejected) {
    if (rejected && rejected.bind && this.context) {
      rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.catch(rejected), this.context);
  };

  p.finally = function (callback) {
    return this.then(function (value) {
      callback.call(this);
      return value;
    }, function (reason) {
      callback.call(this);
      return Promise.reject(reason);
    });
  };

  var _ref = {},
      hasOwnProperty = _ref.hasOwnProperty;
  var slice = [].slice;
  var debug = false;
  var inBrowser = typeof window !== 'undefined';
  function warn(msg) {
    if (typeof console !== 'undefined' && debug) {
      console.warn("[VueResource warn]: ".concat(msg));
    }
  }
  function error(msg) {
    if (typeof console !== 'undefined') {
      console.error(msg);
    }
  }
  function trim(str) {
    return str ? str.replace(/^\s*|\s*$/g, '') : '';
  }
  function trimEnd(str, chars) {
    if (str && chars === undefined) {
      return str.replace(/\s+$/, '');
    }

    if (!str || !chars) {
      return str;
    }

    return str.replace(new RegExp("[".concat(chars, "]+$")), '');
  }
  function toLower(str) {
    return str ? str.toLowerCase() : '';
  }
  function toUpper(str) {
    return str ? str.toUpperCase() : '';
  }
  var isArray = Array.isArray;
  function isString(val) {
    return typeof val === 'string';
  }
  function isFunction(val) {
    return typeof val === 'function';
  }
  function isObject(obj) {
    return obj !== null && _typeof(obj) === 'object';
  }
  function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;
  }
  function isBlob(obj) {
    return typeof Blob !== 'undefined' && obj instanceof Blob;
  }
  function isFormData(obj) {
    return typeof FormData !== 'undefined' && obj instanceof FormData;
  }
  function when(value, fulfilled, rejected) {
    var promise = PromiseObj.resolve(value);

    if (arguments.length < 2) {
      return promise;
    }

    return promise.then(fulfilled, rejected);
  }
  function each(obj, iterator) {
    var i;
    var key;

    if (isArray(obj)) {
      for (i = 0; i < obj.length; i++) {
        iterator.call(obj[i], obj[i], i);
      }
    } else if (isObject(obj)) {
      for (key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          iterator.call(obj[key], obj[key], key);
        }
      }
    }

    return obj;
  }
  var assign = Object.assign || _assign;
  function merge(target) {
    var args = slice.call(arguments, 1);
    args.forEach(function (source) {
      _merge(target, source, true);
    });
    return target;
  }
  function defaults(target) {
    var args = slice.call(arguments, 1);
    args.forEach(function (source) {
      for (var key in source) {
        if (target[key] === undefined) {
          target[key] = source[key];
        }
      }
    });
    return target;
  }

  function _assign(target) {
    var args = slice.call(arguments, 1);
    args.forEach(function (source) {
      _merge(target, source);
    });
    return target;
  }

  function _merge(target, source, deep) {
    for (var key in source) {
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
          target[key] = {};
        }

        if (isArray(source[key]) && !isArray(target[key])) {
          target[key] = [];
        }

        _merge(target[key], source[key], deep);
      } else if (source[key] !== undefined) {
        target[key] = source[key];
      }
    }
  }

  /**
   * Root Prefix Transform.
   */
  function root (options, next) {
    var url = next(options);

    if (isString(options.root) && !/^(https?:)?\//.test(url)) {
      url = "".concat(trimEnd(options.root, '/'), "/").concat(url);
    }

    return url;
  }

  /**
   * Query Parameter Transform.
   */
  function query (options, next) {
    var urlParams = Object.keys(Url.options.params);
    var query = {};
    var url = next(options);
    each(options.params, function (value, key) {
      if (urlParams.indexOf(key) === -1) {
        query[key] = value;
      }
    });
    query = Url.params(query);

    if (query) {
      url += (url.indexOf('?') == -1 ? '?' : '&') + query;
    }

    return url;
  }

  /**
   * URL Template v2.0.6 (https://github.com/bramstein/url-template)
   */
  function expand(url, params, variables) {
    var tmpl = parse(url),
        expanded = tmpl.expand(params);

    if (variables) {
      variables.push.apply(variables, tmpl.vars);
    }

    return expanded;
  }
  function parse(template) {
    var operators = ['+', '#', '.', '/', ';', '?', '&'],
        variables = [];
    return {
      vars: variables,
      expand: function expand(context) {
        return template.replace(/\{([^{}]+)\}|([^{}]+)/g, function (_, expression, literal) {
          if (expression) {
            var operator = null,
                values = [];

            if (operators.indexOf(expression.charAt(0)) !== -1) {
              operator = expression.charAt(0);
              expression = expression.substr(1);
            }

            expression.split(/,/g).forEach(function (variable) {
              var tmp = /([^:*]*)(?::(\d+)|(\*))?/.exec(variable);
              values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
              variables.push(tmp[1]);
            });

            if (operator && operator !== '+') {
              var separator = ',';

              if (operator === '?') {
                separator = '&';
              } else if (operator !== '#') {
                separator = operator;
              }

              return (values.length !== 0 ? operator : '') + values.join(separator);
            } else {
              return values.join(',');
            }
          } else {
            return encodeReserved(literal);
          }
        });
      }
    };
  }

  function getValues(context, operator, key, modifier) {
    var value = context[key],
        result = [];

    if (isDefined(value) && value !== '') {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        value = value.toString();

        if (modifier && modifier !== '*') {
          value = value.substring(0, parseInt(modifier, 10));
        }

        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
      } else {
        if (modifier === '*') {
          if (Array.isArray(value)) {
            value.filter(isDefined).forEach(function (value) {
              result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
            });
          } else {
            Object.keys(value).forEach(function (k) {
              if (isDefined(value[k])) {
                result.push(encodeValue(operator, value[k], k));
              }
            });
          }
        } else {
          var tmp = [];

          if (Array.isArray(value)) {
            value.filter(isDefined).forEach(function (value) {
              tmp.push(encodeValue(operator, value));
            });
          } else {
            Object.keys(value).forEach(function (k) {
              if (isDefined(value[k])) {
                tmp.push(encodeURIComponent(k));
                tmp.push(encodeValue(operator, value[k].toString()));
              }
            });
          }

          if (isKeyOperator(operator)) {
            result.push(encodeURIComponent(key) + '=' + tmp.join(','));
          } else if (tmp.length !== 0) {
            result.push(tmp.join(','));
          }
        }
      }
    } else {
      if (operator === ';') {
        result.push(encodeURIComponent(key));
      } else if (value === '' && (operator === '&' || operator === '?')) {
        result.push(encodeURIComponent(key) + '=');
      } else if (value === '') {
        result.push('');
      }
    }

    return result;
  }

  function isDefined(value) {
    return value !== undefined && value !== null;
  }

  function isKeyOperator(operator) {
    return operator === ';' || operator === '&' || operator === '?';
  }

  function encodeValue(operator, value, key) {
    value = operator === '+' || operator === '#' ? encodeReserved(value) : encodeURIComponent(value);

    if (key) {
      return encodeURIComponent(key) + '=' + value;
    } else {
      return value;
    }
  }

  function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
      if (!/%[0-9A-Fa-f]/.test(part)) {
        part = encodeURI(part);
      }

      return part;
    }).join('');
  }

  /**
   * URL Template (RFC 6570) Transform.
   */
  function template (options) {
    var variables = [];
    var url = expand(options.url, options.params, variables);
    variables.forEach(function (key) {
      delete options.params[key];
    });
    return url;
  }

  /**
   * Service for URL templating.
   */
  function Url(url, params) {
    var self = this || {};
    var options = url;
    var transform;

    if (isString(url)) {
      options = {
        url: url,
        params: params
      };
    }

    options = merge({}, Url.options, self.$options, options);
    Url.transforms.forEach(function (handler) {
      if (isString(handler)) {
        handler = Url.transform[handler];
      }

      if (isFunction(handler)) {
        transform = factory(handler, transform, self.$vm);
      }
    });
    return transform(options);
  }
  /**
   * Url options.
   */

  Url.options = {
    url: '',
    root: null,
    params: {}
  };
  /**
   * Url transforms.
   */

  Url.transform = {
    template: template,
    query: query,
    root: root
  };
  Url.transforms = ['template', 'query', 'root'];
  /**
   * Encodes a Url parameter string.
   *
   * @param {Object} obj
   */

  Url.params = function (obj) {
    var params = [];
    var escape = encodeURIComponent;

    params.add = function (key, value) {
      if (isFunction(value)) {
        value = value();
      }

      if (value === null) {
        value = '';
      }

      this.push("".concat(escape(key), "=").concat(escape(value)));
    };

    serialize(params, obj);
    return params.join('&').replace(/%20/g, '+');
  };
  /**
   * Parse a URL and return its components.
   *
   * @param {String} url
   */


  Url.parse = function (url) {
    var el = document.createElement('a');

    if (document.documentMode) {
      el.href = url;
      url = el.href;
    }

    el.href = url;
    return {
      href: el.href,
      protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
      port: el.port,
      host: el.host,
      hostname: el.hostname,
      pathname: el.pathname.charAt(0) === '/' ? el.pathname : "/".concat(el.pathname),
      search: el.search ? el.search.replace(/^\?/, '') : '',
      hash: el.hash ? el.hash.replace(/^#/, '') : ''
    };
  };

  function factory(handler, next, vm) {
    return function (options) {
      return handler.call(vm, options, next);
    };
  }

  function serialize(params, obj, scope) {
    var array = isArray(obj);
    var plain = isPlainObject(obj);
    var hash;
    each(obj, function (value, key) {
      hash = isObject(value) || isArray(value);

      if (scope) {
        key = "".concat(scope, "[").concat(plain || hash ? key : '', "]");
      }

      if (!scope && array) {
        params.add(value.name, value.value);
      } else if (hash) {
        serialize(params, value, key);
      } else {
        params.add(key, value);
      }
    });
  }

  /**
   * XDomain client (Internet Explorer).
   */
  function xdrClient (request) {
    return new PromiseObj(function (resolve) {
      var xdr = new XDomainRequest();

      var handler = function handler(_ref) {
        var type = _ref.type;
        var status = 0;

        if (type === 'load') {
          status = 200;
        } else if (type === 'error') {
          status = 500;
        }

        resolve(request.respondWith(xdr.responseText, {
          status: status
        }));
      };

      request.abort = function () {
        return xdr.abort();
      };

      xdr.open(request.method, request.getUrl());

      if (request.timeout) {
        xdr.timeout = request.timeout;
      }

      xdr.onload = handler;
      xdr.onabort = handler;
      xdr.onerror = handler;
      xdr.ontimeout = handler;

      xdr.onprogress = function () {};

      xdr.send(request.getBody());
    });
  }

  /**
   * CORS Interceptor.
   */
  var SUPPORTS_CORS = inBrowser && 'withCredentials' in new XMLHttpRequest();
  function cors (request) {
    if (inBrowser) {
      var orgUrl = Url.parse(location.href);
      var reqUrl = Url.parse(request.getUrl());

      if (reqUrl.protocol !== orgUrl.protocol || reqUrl.host !== orgUrl.host) {
        request.crossOrigin = true;
        request.emulateHTTP = false;

        if (!SUPPORTS_CORS) {
          request.client = xdrClient;
        }
      }
    }
  }

  /**
   * Form data Interceptor.
   */
  function form (request) {
    if (isFormData(request.body)) {
      request.headers.delete('Content-Type');
    } else if (isObject(request.body) && request.emulateJSON) {
      request.body = Url.params(request.body);
      request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }
  }

  /**
   * JSON Interceptor.
   */
  function json (request) {
    var type = request.headers.get('Content-Type') || '';

    if (isObject(request.body) && type.indexOf('application/json') === 0) {
      request.body = JSON.stringify(request.body);
    }

    return function (response) {
      return response.bodyText ? when(response.text(), function (text) {
        var type = response.headers.get('Content-Type') || '';

        if (type.indexOf('application/json') === 0 || isJson(text)) {
          try {
            response.body = JSON.parse(text);
          } catch (e) {
            response.body = null;
          }
        } else {
          response.body = text;
        }

        return response;
      }) : response;
    };
  }

  function isJson(str) {
    var start = str.match(/^\s*(\[|\{)/);
    var end = {
      '[': /]\s*$/,
      '{': /}\s*$/
    };
    return start && end[start[1]].test(str);
  }

  /**
   * JSONP client (Browser).
   */
  function jsonpClient (request) {
    return new PromiseObj(function (resolve) {
      var name = request.jsonp || 'callback';
      var callback = request.jsonpCallback || "_jsonp".concat(Math.random().toString(36).substr(2));
      var body = null;
      var handler;
      var script;

      handler = function handler(_ref) {
        var type = _ref.type;
        var status = 0;

        if (type === 'load' && body !== null) {
          status = 200;
        } else if (type === 'error') {
          status = 500;
        }

        if (status && window[callback]) {
          delete window[callback];
          document.body.removeChild(script);
        }

        resolve(request.respondWith(body, {
          status: status
        }));
      };

      window[callback] = function (result) {
        body = JSON.stringify(result);
      };

      request.abort = function () {
        handler({
          type: 'abort'
        });
      };

      request.params[name] = callback;

      if (request.timeout) {
        setTimeout(request.abort, request.timeout);
      }

      script = document.createElement('script');
      script.src = request.getUrl();
      script.type = 'text/javascript';
      script.async = true;
      script.onload = handler;
      script.onerror = handler;
      document.body.appendChild(script);
    });
  }

  /**
   * JSONP Interceptor.
   */
  function jsonp (request) {
    if (request.method === 'JSONP') {
      request.client = jsonpClient;
    }
  }

  /**
   * Before Interceptor.
   */
  function before (request) {
    if (isFunction(request.before)) {
      request.before.call(this, request);
    }
  }

  /**
   * HTTP method override Interceptor.
   */
  function method (request) {
    if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
      request.headers.set('X-HTTP-Method-Override', request.method);
      request.method = 'POST';
    }
  }

  /**
   * Header Interceptor.
   */
  function header (request) {
    var headers = assign({}, Http.headers.common, !request.crossOrigin ? Http.headers.custom : {}, Http.headers[toLower(request.method)]);
    each(headers, function (value, name) {
      if (!request.headers.has(name)) {
        request.headers.set(name, value);
      }
    });
  }

  /**
   * XMLHttp client (Browser).
   */
  function xhrClient (request) {
    return new PromiseObj(function (resolve) {
      var xhr = new XMLHttpRequest();

      var handler = function handler(event) {
        var response = request.respondWith('response' in xhr ? xhr.response : xhr.responseText, {
          status: xhr.status === 1223 ? 204 : xhr.status,
          // IE9 status bug
          statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText)
        });
        each(trim(xhr.getAllResponseHeaders()).split('\n'), function (row) {
          response.headers.append(row.slice(0, row.indexOf(':')), row.slice(row.indexOf(':') + 1));
        });
        resolve(response);
      };

      request.abort = function () {
        return xhr.abort();
      };

      xhr.open(request.method, request.getUrl(), true);

      if (request.timeout) {
        xhr.timeout = request.timeout;
      }

      if (request.responseType && 'responseType' in xhr) {
        xhr.responseType = request.responseType;
      }

      if (request.withCredentials || request.credentials) {
        xhr.withCredentials = true;
      }

      if (!request.crossOrigin) {
        request.headers.set('X-Requested-With', 'XMLHttpRequest');
      } // deprecated use downloadProgress


      if (isFunction(request.progress) && request.method === 'GET') {
        xhr.addEventListener('progress', request.progress);
      }

      if (isFunction(request.downloadProgress)) {
        xhr.addEventListener('progress', request.downloadProgress);
      } // deprecated use uploadProgress


      if (isFunction(request.progress) && /^(POST|PUT)$/i.test(request.method)) {
        xhr.upload.addEventListener('progress', request.progress);
      }

      if (isFunction(request.uploadProgress) && xhr.upload) {
        xhr.upload.addEventListener('progress', request.uploadProgress);
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });
      xhr.onload = handler;
      xhr.onabort = handler;
      xhr.onerror = handler;
      xhr.ontimeout = handler;
      xhr.send(request.getBody());
    });
  }

  /**
   * After Interceptor.
   */
  function sendAfter (request) {
    // token 方式取消
    if (request.cancelToken) {
      request.cancelToken.promise.then(function () {
        // 取消请求
        request.abort();
      });
    } // send后，这里可以获取到请求后的 request 方法，也可以在这里取消请求


    if (isFunction(request.sendAfter)) {
      request.sendAfter.call(this, request);
    }
  }

  function Client (context) {
    // 拦截器队列，初始化的即为当前的请求
    var reqHandlers = [sendRequest];
    var resHandlers = [];

    if (!isObject(context)) {
      context = null;
    }

    function Client(request) {
      while (reqHandlers.length) {
        // 弹出所有的拦截器，先进后出 顺序如下
        // [sendRequest, ... 系统初始化的那几个拦截器，...用户手动push的拦截器]
        var handler = reqHandlers.pop();

        if (isFunction(handler)) {
          var _ret = function () {
            var response = void 0;
            var next = void 0; // 依次自行拦截器的request 返回 response
            // 改变当前 request.client 都是在系统拦截器request执行做的操作

            response = handler.call(context, request, function (val) {
              return next = val;
            }) || next; // response 是否为Object
            // 这里isObject 的 handler 实际是等于初始化的第一个拦截器 sendRequest ，只有sendRequest 才返回一个自定义的包含context 的promise对象

            if (isObject(response)) {
              return {
                v: new PromiseObj(function (resolve, reject) {
                  // 依次执行 response ，Promise return promise 的结构
                  // 接口调用client(request)-> 拦截器res[0] -> 拦截器res[1]
                  resHandlers.forEach(function (handler) {
                    response = when(response, function (response) {
                      return handler.call(context, response) || response;
                    }, reject);
                  }); // 接口调用和拦截器都执行完，请求 resolve or reject

                  when(response, resolve, reject);
                }, context)
              };
            } // response 是否为 function，用户配置的都是function 或者没有 return
            // req最后一个先弹出，新执行，res 却依次往前追加
            // 所以这里会导致拦截器中的 request 后面的先执行，而response 却前面的先执行 ...


            if (isFunction(response)) {
              resHandlers.unshift(response);
            }
          }();

          if (_typeof(_ret) === "object") return _ret.v;
        } else {
          warn("Invalid interceptor of type ".concat(_typeof(handler), ", must be a function"));
        }
      }
    }

    Client.use = function (handler) {
      reqHandlers.push(handler);
    };

    return Client;
  } // 拦截器队列初始值为接口调用

  function sendRequest(request) {
    // const client = request.client || (inBrowser ? xhrClient : nodeClient);
    var client = request.client || xhrClient;
    var res = client(request); // 这里才会注入对应 client 的abort 方法

    sendRequestAfter(request);
    return res;
  } // 添加该方法 实现取消当前请求的能力


  function sendRequestAfter(request) {
    // request.abort();
    // 不兼容 vue 的this了
    sendAfter.call(null, request);
  }

  var Headers = /*#__PURE__*/function () {
    function Headers(headers) {
      var _this = this;

      _classCallCheck(this, Headers);

      this.map = {};
      each(headers, function (value, name) {
        return _this.append(name, value);
      });
    }

    _createClass(Headers, [{
      key: "has",
      value: function has(name) {
        return getName(this.map, name) !== null;
      }
    }, {
      key: "get",
      value: function get(name) {
        var list = this.map[getName(this.map, name)];
        return list ? list.join() : null;
      }
    }, {
      key: "getAll",
      value: function getAll(name) {
        return this.map[getName(this.map, name)] || [];
      }
    }, {
      key: "set",
      value: function set(name, value) {
        this.map[normalizeName(getName(this.map, name) || name)] = [trim(value)];
      }
    }, {
      key: "append",
      value: function append(name, value) {
        var list = this.map[getName(this.map, name)];

        if (list) {
          list.push(trim(value));
        } else {
          this.set(name, value);
        }
      }
    }, {
      key: "delete",
      value: function _delete(name) {
        delete this.map[getName(this.map, name)];
      }
    }, {
      key: "deleteAll",
      value: function deleteAll() {
        this.map = {};
      }
    }, {
      key: "forEach",
      value: function forEach(callback, thisArg) {
        var _this2 = this;

        each(this.map, function (list, name) {
          each(list, function (value) {
            return callback.call(thisArg, value, name, _this2);
          });
        });
      }
    }]);

    return Headers;
  }();

  function getName(map, name) {
    return Object.keys(map).reduce(function (prev, curr) {
      return toLower(name) === toLower(curr) ? curr : prev;
    }, null);
  }

  function normalizeName(name) {
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }

    return trim(name);
  }

  var Response = /*#__PURE__*/function () {
    function Response(body, _ref) {
      var url = _ref.url,
          headers = _ref.headers,
          status = _ref.status,
          statusText = _ref.statusText;

      _classCallCheck(this, Response);

      this.url = url;
      this.ok = status >= 200 && status < 300;
      this.status = status || 0;
      this.statusText = statusText || '';
      this.headers = new Headers(headers);
      this.body = body;

      if (isString(body)) {
        this.bodyText = body;
      } else if (isBlob(body)) {
        this.bodyBlob = body;

        if (isBlobText(body)) {
          this.bodyText = blobText(body);
        }
      }
    }

    _createClass(Response, [{
      key: "blob",
      value: function blob() {
        return when(this.bodyBlob);
      }
    }, {
      key: "text",
      value: function text() {
        return when(this.bodyText);
      }
    }, {
      key: "json",
      value: function json() {
        return when(this.text(), function (text) {
          return JSON.parse(text);
        });
      }
    }]);

    return Response;
  }();
  Object.defineProperty(Response.prototype, 'data', {
    get: function get() {
      return this.body;
    },
    set: function set(body) {
      this.body = body;
    }
  });

  function blobText(body) {
    return new PromiseObj(function (resolve) {
      var reader = new FileReader();
      reader.readAsText(body);

      reader.onload = function () {
        resolve(reader.result);
      };
    });
  }

  function isBlobText(body) {
    return body.type.indexOf('text') === 0 || body.type.indexOf('json') !== -1;
  }

  var Request = /*#__PURE__*/function () {
    function Request(options) {
      _classCallCheck(this, Request);

      this.body = null;
      this.params = {};
      assign(this, options, {
        method: toUpper(options.method || 'GET')
      });

      if (!(this.headers instanceof Headers)) {
        this.headers = new Headers(this.headers);
      }
    }

    _createClass(Request, [{
      key: "getUrl",
      value: function getUrl() {
        return Url(this);
      }
    }, {
      key: "getBody",
      value: function getBody() {
        return this.body;
      }
    }, {
      key: "respondWith",
      value: function respondWith(body, options) {
        return new Response(body, assign(options || {}, {
          url: this.getUrl()
        }));
      }
    }]);

    return Request;
  }();

  /**
   * Created by Liu.Jun on 2018/12/15.
   */
  // import Cancel from './Cancel';
  var CancelTken = /*#__PURE__*/function () {
    function CancelTken(executor) {
      var _this = this;

      _classCallCheck(this, CancelTken);

      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      } // 通过该 promise 来监听取消操作
      // 这里完美的解决了 取消动作只能在异步请求发起后才能取消的问题


      var resolvePromise;
      this.promise = new Promise(function (resolve) {
        resolvePromise = resolve;
      }); // 取消信息

      executor(function () {
        if (_this.reason) {
          // 已取消过
          return;
        } // this.reason = new Cancel(message);


        resolvePromise();
      });
    }
    /**
     * 返回对象包含当前的取消方法和一个 CancelToken 的实例
     * @returns {{token: CancelTken, cancel: *}}
     */


    _createClass(CancelTken, null, [{
      key: "source",
      value: function source() {
        var cancel;
        var token = new CancelTken(function (c) {
          cancel = c;
        });
        return {
          token: token,
          cancel: cancel
        };
      }
    }]);

    return CancelTken;
  }();

  /**
   * Service for sending network requests.
   */
  var COMMON_HEADERS = {
    Accept: 'application/json, text/plain, */*'
  };
  var JSON_CONTENT_TYPE = {
    'Content-Type': 'application/json;charset=utf-8'
  };
  function Http(options) {
    // bind 当前this
    var self = this || {};
    var client = Client(self.$vm);
    defaults(options || {}, self.$options, Http.options); // interceptors use 到当前的请求

    Http.interceptors.forEach(function (handler) {
      // 系统默认的拦截器，通过配置可以重置，比如更换jsonp的实现可以通过此操作
      if (isString(handler)) {
        handler = Http.interceptor[handler];
      }

      if (isFunction(handler)) {
        client.use(handler);
      }
    });
    return client(new Request(options)).then(function (response) {
      return response.ok ? response : PromiseObj.reject(response);
    }, function (response) {
      if (response instanceof Error) {
        error(response);
      }

      return PromiseObj.reject(response);
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
  Http.CancelToken = CancelTken;
  Http.interceptor = {
    before: before,
    method: method,
    jsonp: jsonp,
    json: json,
    form: form,
    header: header,
    cors: cors
  };
  Http.interceptors = ['before', 'method', 'jsonp', 'json', 'form', 'header', 'cors'];
  ['get', 'delete', 'head', 'jsonp'].forEach(function (itemMethod) {
    Http[itemMethod] = function (url, options) {
      return this(assign(options || {}, {
        url: url,
        itemMethod: itemMethod
      }));
    };
  });
  ['post', 'put', 'patch'].forEach(function (itemMethod) {
    Http[itemMethod] = function (url, body, options) {
      return this(assign(options || {}, {
        url: url,
        itemMethod: itemMethod,
        body: body
      }));
    };
  });

  var config = {
    showLoading: function showLoading() {
      console.log('loading'); // document.body.style.backgroundColor = 'red';
    },
    hideLoading: function hideLoading() {
      console.log('loading end'); // setTimeout(() => {
      //     document.body.style.backgroundColor = '';
      // });
    }
  };

  function get() {
    return config;
  }

  function set(userConfig) {
    Object.assign(config, userConfig);
  }

  var userConfig = {
    get: get,
    set: set
  };

  /**
   * Created by Liu.Jun on 2018/12/14.
   */
  var loading = null; // loading层

  var loadingSock = 0;
  /**
   *
   * @param config
   * @param status 1=> fetch start ; other => fetch end
   */

  function loadingStatus(config, status) {
    if (config && config.loading) {
      if (status === 1) {
        loadingSock += 1;

        if (loadingSock === 1) {
          loading = userConfig.get().showLoading();
        }
      } else {
        setTimeout(function () {
          loadingSock -= 1;

          if (loadingSock === 0) {
            userConfig.get().hideLoading(loading);
          }
        }, 0);
      }
    }
  }

  var defaultsParams = function defaultsParams() {
    return {
      method: 'GET',
      params: Object.create(null),
      // transformParams: () => {}, // 调用前的参数转换，返回新的参数 ， 支持 promise
      loading: false,
      // 请求过程中是否显示loading
      cache: false,
      // get,jsonp请求有效， JSONP callback 固定，固定请求地址命中 cdn，去掉params 的随机数
      // cancelToken: new http.CancelToken(), // 用于取消的令牌，类似 axios 的取消
      isCancel: true,
      // 如果第二次请求发起在第一次请求结束之前，取消第一次请求
      useLocalCache: 0,
      // resolve就缓存 通过本地缓存cache 接口数据，0 不缓存，单位 （s） 3 * 24 * 60 * 60
      usePreResult: false // 多次请求同一个接口，皆返回第一次请求的数据，不会判断参数变更，谨慎使用

    };
  };

  var Service = /*#__PURE__*/function () {
    function Service(params) {
      _classCallCheck(this, Service);

      this.httpParams = _objectSpread2(_objectSpread2(_objectSpread2({}, defaultsParams()), this.useDefaultParams()), params);
    }

    _createClass(Service, [{
      key: "useDefaultParams",
      value: function useDefaultParams() {
        return {};
      }
      /**
       * 本地缓存通过请求和参数生成 唯一key
       * @param params
       * @returns {*}
       */

    }, {
      key: "cancelContr",

      /**
       * 取消控制
       * @param curParams
       * @returns {*}
       */
      value: function cancelContr(curParams) {
        // 第二次请求时 尝试取消第一次请求
        if (curParams.isCancel) {
          this.cancel();
        } // 如果 cancelToken 是用户传入，那么取消操作需要用户自行控制


        if (curParams.cancelToken) {
          return curParams.cancelToken;
        }

        this.cancelSource = Http.CancelToken.source();
        return this.cancelSource.token;
      } // 可以对params 做最终发起http请求前的微调，引用 直接修改源数据

    }, {
      key: "preHttpCall",
      value: function preHttpCall(params) {}
      /**
       * http请求
       * @param userParams
       * @returns {Promise<*>}
       */

    }, {
      key: "http",
      value: function () {
        var _http2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userParams) {
          var _this = this;

          var curParams, localCacheName, _Service$getLocalCach, tempName, result, cancelToken, finalHttpParams;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return Service.getParams(this.httpParams, userParams);

                case 2:
                  curParams = _context.sent;

                  if (!(curParams.usePreResult && this.$preResult)) {
                    _context.next = 5;
                    break;
                  }

                  return _context.abrupt("return", this.$preResult);

                case 5:
                  if (!(curParams.useLocalCache > 0)) {
                    _context.next = 10;
                    break;
                  }

                  _Service$getLocalCach = Service.getLocalCache(curParams), tempName = _Service$getLocalCach.localCacheName, result = _Service$getLocalCach.result;
                  localCacheName = tempName;

                  if (!result) {
                    _context.next = 10;
                    break;
                  }

                  return _context.abrupt("return", result);

                case 10:
                  // 取消操作
                  cancelToken = this.cancelContr(curParams); // loading 开启

                  loadingStatus(curParams, 1);
                  finalHttpParams = _objectSpread2({
                    cancelToken: cancelToken
                  }, curParams);
                  this.preHttpCall(finalHttpParams);
                  this.$preResult = Http(finalHttpParams).then(function (res) {
                    var resType = Object.prototype.toString.call(res.body);

                    if (resType === '[object Object]') {
                      if (curParams.useLocalCache) {
                        Service.setLocalCache(localCacheName, res.body);
                      } // 默认service 会直接返回response.data中的数据，方便后续的调用
                      // 原response 对象会保存在 $_response 中


                      res.body.$_response = res;
                      return res.body;
                    } // blob 或者其它string 调用者自行处理


                    return res;
                  }).finally(function () {
                    // loading 关闭
                    loadingStatus(curParams, 0); // ...

                    _this.cancelSource = null;
                  });
                  return _context.abrupt("return", this.$preResult);

                case 16:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function http(_x) {
          return _http2.apply(this, arguments);
        }

        return http;
      }() // 取消请求

    }, {
      key: "cancel",
      value: function cancel() {
        // 这里直接取消当前Service 的前一次调用
        if (this.cancelSource) {
          this.cancelSource.cancel();
          this.cancelSource = null;
        }
      }
    }], [{
      key: "getLocalCacheKey",
      value: function getLocalCacheKey(params) {
        try {
          var a = document.createElement('a');
          a.setAttribute('href', params.url);

          var query = _objectSpread2(_objectSpread2({}, params.params), String(params.data) === params.data ? {
            pdata: params.data
          } : params.data);

          delete query._;
          var queryStr = Object.entries(query).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            return "".concat(key, "_").concat(value);
          }).join('_');
          return "__".concat(a.pathname, "_").concat(queryStr).replace(/[^a-z | A-Z | \d]/g, '_');
        } catch (e) {
          return false;
        }
      } // josnp 固定callback

    }, {
      key: "getPathName",
      value: function getPathName(url) {
        var a = document.createElement('a');
        a.setAttribute('href', url);
        return a.pathname.replace(/[^a-z]/g, '_'); // return a.pathname.replace(/\//g, '').replace(/-/g, '');
      }
      /**
       * merge 参数
       * @param httpParams
       * @param userParams
       * @returns {Promise<{}>}
       */

    }, {
      key: "getParams",
      value: function () {
        var _getParams = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(httpParams, userParams) {
          var curParams, transParams;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  // merger params
                  curParams = _objectSpread2(_objectSpread2({}, httpParams), userParams); // transformParams:  调用前的参数转换，支持 promise 或者普通function

                  _context2.prev = 1;

                  if (!curParams.transformParams) {
                    _context2.next = 7;
                    break;
                  }

                  _context2.next = 5;
                  return curParams.transformParams(curParams);

                case 5:
                  transParams = _context2.sent;

                  if (transParams) {
                    curParams = transParams;
                  }

                case 7:
                  _context2.next = 12;
                  break;

                case 9:
                  _context2.prev = 9;
                  _context2.t0 = _context2["catch"](1);
                  // nothing
                  console.warn('transformParams reject ..');

                case 12:
                  // cache: 处理get 或 jsonp 请求
                  curParams.method = curParams.method.toLocaleUpperCase();

                  if (curParams.method === 'GET' || curParams.method === 'JSONP') {
                    if (!curParams.cache) {
                      // 随机数
                      curParams.params._ = +new Date();
                    } else {
                      // jsonp 固定callback
                      curParams.jsonpCallback = curParams.jsonpCallback || Service.getPathName(curParams.url) || undefined;
                    }
                  }

                  return _context2.abrupt("return", curParams);

                case 15:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[1, 9]]);
        }));

        function getParams(_x2, _x3) {
          return _getParams.apply(this, arguments);
        }

        return getParams;
      }()
      /**
       * 获取本地cache
       * @param curParams
       * @returns {{localCacheName: *, result: *}}
       */

    }, {
      key: "getLocalCache",
      value: function getLocalCache(curParams) {
        var localCacheName = Service.getLocalCacheKey(curParams);
        var result;

        if (localCacheName) {
          // 正常获取key名
          try {
            var cacheData = JSON.parse(window.sessionStorage.getItem(localCacheName));
            var lastCacheTime = cacheData.lastCacheTime,
                tempResult = cacheData.result; // 判断过期状态

            if (lastCacheTime + curParams.useLocalCache >= Math.round(+new Date() / 1000)) {
              result = tempResult;
            }
          } catch (e) {// nothing
          }
        }

        return {
          localCacheName: localCacheName,
          result: result
        };
      } // 更新本地cache

    }, {
      key: "setLocalCache",
      value: function setLocalCache(localCacheName, data) {
        setTimeout(function () {
          // 设置缓存和缓存时的时间
          try {
            var result = _objectSpread2({}, data);

            delete result.$_response;
            window.sessionStorage.setItem(localCacheName, JSON.stringify({
              result: result,
              lastCacheTime: Math.round(+new Date() / 1000)
            }));
          } catch (e) {// nothing
          }
        }, 0);
      }
    }]);

    return Service;
  }();

  exports.Service = Service;
  exports.http = Http;
  exports.serviceConfig = userConfig;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
