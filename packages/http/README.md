# @lljj/http 基础http模块

基于 vue-resource ，提供 xhr 或jsonp请求
> * 去除源码对 vue context指向的兼容代码
> * 去除源码对 node http 服务的兼容
> * 添加内部拦截器 sendAfter ,请求发起后执行，这个状态下request 已经可以abort
> * 添加sendAfter回调用方法，接受 request参数，简单取消可以直接在这里操作
> * 添加 http.CancelToken 类，类似 axios CancelToken，更灵活的控制取消请求
> * 添加 Service 类，提供统一的http服务

>注：源码目前还存在一个循环依赖并未处理 。

## 模块
暴露三个模块：
```js
import { http, Service, serviceConfig } from '@lljj/http';
```
>* http： 基于vue resource 的http基础模块实现
>* [Service](#service)：独立Service为每个接口调用，扩展了些新的参数
>* [serviceConfig](#service参数)：对扩展Service的一些初始化配置，只有在使用Service时才需要

## 特性

- 支持[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 和 [URI Templates](https://medialize.github.io/URI.js/uri-template.html)
- 支持请求和响应拦截器 [interceptors](#http拦截器)
- 支持 最新 Firefox, Chrome, Safari, Opera ， IE9+

## 安装
```
npm install --save @lljj/http
```

使用 yarn
```
yarn add @lljj/http
```

## 例子
```js
import { http, Service } from '@lljj/http';

{
  // GET /someUrl
    http.get('/test.json').then(response => {

        // get body data
        console.log(response.body);
    }, response => {
        // error callback
    });
}
```

## 文档

- [HTTP配置](#http配置)
- [HTTP 请求/响应](#http)
- [代码示例](#代码示例)
- [API 参考](#api-参考)
- [Service](#service)

---

## HTTP配置

使用全局配置设置默认值

```js
import { http } from '@lljj/http';
http.options.root = '/root';
http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';
```

配置了root选项，请求的路径必须是相对路径，`http.get('someUrl')` 不会: `http.get('/someUrl')`.

#### 传统的web服务器

如果服务器无处处理 `application/json` 的请求头, 可以开启`emulateJSON` 选项.
这将 `application/x-www-form-urlencoded` MIME 类型发送请求, 像普通form表单提交.

```js
http.options.emulateJSON = true;
```

如果您的Web服务器无法处理诸如`PUT`，`PATCH`和`DELETE`之类的REST / HTTP请求，则可以启用`emulateHTTP`选项。 这将使用实际的HTTP方法设置`X-HTTP-Method-Override`标头并使用正常的`POST`请求。

```js
http.options.emulateHTTP = true;
```

---

## HTTP

#### HTTP用法
```js
import { http } from '@lljj/http';

{
  // GET /someUrl
  http.get('/someUrl').then(response => {
    // success callback
  }, response => {
    // error callback
  });
}
```
#### HTTP方法
快捷方式适用于所有类型的请求

```js
http.get('/someUrl', [config]).then(successCallback, errorCallback);
http.post('/someUrl', [body], [config]).then(successCallback, errorCallback);

```
快捷方法列表：

* `get(url, [config])`
* `head(url, [config])`
* `delete(url, [config])`
* `jsonp(url, [config])`
* `post(url, [body], [config])`
* `put(url, [body], [config])`
* `patch(url, [body], [config])`
#### HTTP Config

参数 | 类型 | 描述
--------- | ---- | -----------
url | `string` | 发送请求的URL
body | `Object`, `FormData`, `string` | 要作为请求正文发送的数据
headers | `Object` | 标头对象将作为HTTP请求标头发送
params | `Object` | 要作为URL参数发送的参数对象
method | `string` | HTTP 请求方法 (e.g. GET, POST, ...)
responseType | `string` | 响应正文的类型 (e.g. text, blob, json, ...)
timeout | `number` | 请求超时（以毫秒为单位） (“0”表示没有超时)
credentials | `boolean` | 指示是否应使用凭据进行跨站点访问控制请求
emulateHTTP | `boolean` | 使用HTTP POST发送PUT，PATCH和DELETE请求，并设置`X-HTTP-Method-Override`标头
emulateJSON | `boolean` | 将请求正文发送为`application / x-www-form-urlencoded`内容类型
jsonp | `String` | jsonp callback key名 （默认 callback）
jsonpCallback | `String` | jsonp callback 回调函数名（默认随机生成）
cancelToken | `Object` | 取消请求的对象，包含一个 promise方法，resolve之后取消请求
before | `function(request)` | 回调函数，用于在发送请求对象之前对其进行修改
sendAfter | `function(request)` | 请求发起后，用于在发送请求后的操作，接受request参数，request.abort()可取消当前请求
uploadProgress | `function(event)` | 用于处理上传的[ProgressEvent]（https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent）的回调函数
downloadProgress | `function(event)` | 回调函数来处理下载的[ProgressEvent]（https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent）
#### HTTP Response

请求使用以下属性和方法解析为响应对象：

属性 | 类型 | 描述
-------- | ---- | -----------
url | `string` | Response URL origin
body | `Object`, `Blob`, `string` | Response body
headers | `Header` | Response Headers 对象
ok | `boolean` | HTTP状态代码介于200和299之间
status | `number` | HTTP状态代码
statusText | `string` | HTTP状态文本
**方法** | **类型** | **描述**
text() | `Promise` | 将body解析为字符串
json() | `Promise` | 将body解析为JSON对象
blob() | `Promise` | 将body解析为Blob字符串
#### HTTP例子

```js
{
  // POST /someUrl
  http.post('/someUrl', {foo: 'bar'}).then(response => {

    // get status
    response.status;

    // get status text
    response.statusText;

    // get 'Expires' header
    response.headers.get('Expires');

    // get body data
    this.someData = response.body;

  }, response => {
    // error callback
  });
}
```

使用URL查询参数和自定义请求头发送获取请求。

```js
{
  // GET /someUrl?foo=bar
  this.$http.get('/someUrl', {params: {foo: 'bar'}, headers: {'X-Custom': '...'}}).then(response => {
    // 成功 callback
  }, response => {
    // 失败 callback
  });
}
```

获取图像并使用blob（）方法从响应中提取图像主体内容。

```js
{
  // GET /image.jpg
  http.get('/image.jpg', {responseType: 'blob'}).then(response => {

    // resolve to Blob
    return response.blob();

  }).then(blob => {
    // use image Blob
  });
}
```
#### HTTP拦截器
> 拦截器可以全局定义，用于请求的预处理和后处理
> 拦截器中的 request 使用栈结构，数据先进后出 依次 pop 弹出，response 在依次 unshift，先出的数据会在最后
> 最终的感受是拦截器后添加的会先执行request，response拦截器和添加的顺序保持一致。

```js
http.interceptors.push(function(request) {

  // 修改请求方法
  request.method = 'POST';

  // 需改请求header头
  request.headers.set('X-CSRF-TOKEN', 'TOKEN');
  request.headers.set('Authorization', 'Bearer TOKEN');

});
```
#### HTTP请求和响应处理
```js
http.interceptors.push(function(request) {

  // 修改请求方法
  request.method = 'POST';

  // return response callback
  return function(response) {

    // 修改 response
    response.body = '...';

  };
});
```
#### HTTP返回响应并停止请求
```js
http.interceptors.push(function(request) {

  // 修改请求 ...

  // stop and return response
  return request.respondWith(body, {
    status: 404,
    statusText: 'Not found'
  });
});
```
#### HTTP覆盖默认拦截器（谨慎使用）

可以覆盖所有默认拦截器回调以更改其行为。 所有拦截器都通过`http.interceptor`对象公开，其名称为`before`，`method`，`jsonp`，`json`，`form`，`header`和`cors`。
> 只在一些需要改变内部方式的时候使用，比如想换一个jsonp的实现

```js
http.interceptor.before = function(request) {

  // 覆盖befroe拦截器

};
```

---

## 代码示例

常见代码示例

#### Forms

使用form形式 [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

```js
{
  var formData = new FormData();

  // append string
  formData.append('foo', 'bar');

  // append Blob/File object
  formData.append('pic', fileInput, 'mypic.jpg');

  // POST /someUrl
  http.post('/someUrl', formData).then(response => {
    // success callback
  }, response => {
    // error callback
  });
}
```

#### 终止请求

在即将发送新请求时中止先前的请求。 例如，在输入自动填充输入时。

```js
{
  // GET /someUrl
  http.get('/someUrl', {

    // 使用before callback 取消上一次请求
    before(request) {

      // abort previous request, if exists
      if (this.previousRequest) {
        this.previousRequest.abort();
      }

      this.previousRequest = request;
    },

    // 使用sendAfter callback 取消当次请求
    sendAfter(request) {
        // 取消当前请求
        request.abort();
    }

  }).then(response => {
    // success callback
  }, response => {
    // error callback
  });
}
```

使用 cancelToken 取消请求，一个token可以用来取消多个请求
```js
{
    const source = http.CancelToken.source();

    http({
        url: '/test.json',
        method: 'get',
        cancelToken: source.token,
    }).then(response => {
        // get body data
        console.log(response.body);
    }, response => {
        debugger;
        // error callback
    });

    source.cancel();
}

```

---

---

## API 参考

#### Request

```js
{
  // 构造函数
  constructor(object: config)

  // Properties
  url (string)
  body (any)
  headers (Headers)
  method (string)
  params (object)
  timeout (number)
  jsonp(string)
  jsonpCallback (string)
  cancelToken (Object)
  credentials (boolean)
  emulateHTTP (boolean)
  emulateJSON (boolean)

  before (function(Request))
  afterSend (function(Request))
  progress (function(Event))

  // Methods
  getUrl() (string)
  getBody() (any)
  respondWith(any: body, object: config) (Response)
  abort()
}
```

#### Response

```js
{
  // Constructor
  constructor(any: body, object: {string: url, object: headers, number: status, string: statusText})

  // Properties
  url (string)
  body (any)
  headers (Headers)
  ok (boolean)
  status (number)
  statusText (string)

  // Methods
  blob() (Promise)
  text() (Promise)
  json() (Promise)
}
```

#### Headers

```js
{
  // Constructor
  constructor(object: headers)

  // Properties
  map (object)

  // Methods
  has(string: name) (boolean)
  get(string: name) (string)
  getAll() (string[])
  set(string: name, string: value) (void)
  append(string: name, string: value) (void)
  delete(string: name) (void)
  forEach(function: callback, any: thisArg) (void)
}
```

---

---

## Service
封装每个请求为一个独立的Service，添加了一些特殊的参数

#### Service用法
```js
import { http, Service } from '@lljj/http';

{
    const source = http.CancelToken.source();
    const testService = new Service({
        url: '/test.json',
        method: 'get',
        // loading: true,
        // usePreResult: true,
        cache: true,
        jsonpCallback: 'myCall',
        cancelToken: source.token,
        sendAfter(request) {

        },
        // useLocalCache: 10,
        // cancelToken: source.token,
        // params: {
        //     a: 'b'
        // }
    });

    source.cancel();

    testService.http({
        params: {
            a: 'b'
        }
    })
}
```

#### Service参数
参数传入有多种方式，首先通过 构造函数传入，也可以通过 http 方法传出，会覆盖构造函数参数 , http > constructor > defaults
> 参数支持所有的http调用参数，扩展如下参数：

参数 | 类型 | 描述
--------- | ---- | -----------
loading | `Bool` | 显示请求loading
transformParams | `function` | function(params) ,接受当前请求参数，返回一个新的参数，或者返回一个promise对象
cache | `Bool` | cache 用户固定jsonp callback，和get请求不加随机数
isCancel | `Bool` |  如果第二次请求发起时，是否尝试取消上一次的请求
usePreResult | `Bool` | 多次请求同一个接口，皆返回第一次请求promise实例，不检查参数变更
useLocalCache: 0 | `number` | // resolve就缓存 通过本地缓存（session storage） cache 接口数据，0 不缓存，单位 （s） 3 * 24 * 60 * 60（post只支持简单的数据提交，formData file等不支持）

> 注：如果使用laoding方法，需要先做如下的初始化配置

```js
import { http, Service, serviceConfig } from '@lljj/http';

{
    serviceConfig.set({
        showLoading() {
            console.log('xxxxx');
        },
        hideLoading(params) {
            // 这里params 为调用showLoading 的返回值
            console.log('ddddd');
        }
    });
}
```
>* service 只处理不和业务场景相关的操作
  比如：错误提示，登录状态。loading 是个意外考虑场景比较统一所以允许在初始化的时候传入loading方法
  可以在具体使用场景下继承该类实现相关需求
>* 如果传入了 cancelToken 那就证明是你要自己控制取消，Service 就不会再帮你做取消的操作
  也就是 isCancel的参数是无效的
>* response 会直接返回body数据，$_response 保存原response对象，如果body 不是一个json对象不做处理兼容blob或者字符串

#### Service方法
方法名 | 参数 | 描述
--------- | ---- | -----------
http | `function` | function(params)，发起请求
cancel | `function`, | function() 取消当前请求
preHttpCall | `function`, | function(params) 最终发起请求前最后一次数据调整机会，直接修改源数据
useDefaultParams | `function`, | function() 继承覆盖默认参数，优先级高于service 默认

