/**
 * Created by Liu.Jun on 2018/12/14.
 */
import http from '../http/index';
import { loadingStatus } from './tips';

const defaultsParams = () => ({
    method: 'GET',
    params: Object.create(null),
    // transformParams: () => {}, // 调用前的参数转换，返回新的参数 ， 支持 promise
    loading: false, // 请求过程中是否显示loading
    cache: false, // get,jsonp请求有效， JSONP callback 固定，固定请求地址命中 cdn，去掉params 的随机数
    // cancelToken: new http.CancelToken(), // 用于取消的令牌，类似 axios 的取消
    isCancel: true, // 如果第二次请求发起在第一次请求结束之前，取消第一次请求
    useLocalCache: 0, // resolve就缓存 通过本地缓存cache 接口数据，0 不缓存，单位 （s） 3 * 24 * 60 * 60
    usePreResult: false, // 多次请求同一个接口，皆返回第一次请求的数据，不会判断参数变更，谨慎使用
});

class Service {
    constructor(params) {
        this.httpParams = {
            ...defaultsParams(),
            ...this.useDefaultParams(),
            ...params
        };
    }

    useDefaultParams() {
        return {};
    }

    /**
     * 本地缓存通过请求和参数生成 唯一key
     * @param params
     * @returns {*}
     */
    static getLocalCacheKey(params) {
        try {
            const a = document.createElement('a');
            a.setAttribute('href', params.url);
            const query = {
                ...params.params,
                ...String(params.data) === params.data ? {
                    pdata: params.data
                } : params.data
            };

            delete query._;

            const queryStr = Object.entries(query).map(([key, value]) => `${key}_${value}`).join('_');
            return `__${a.pathname}_${queryStr}`.replace(/[^a-z | A-Z | \d]/g, '_');
        } catch (e) {
            return false;
        }
    }

    // josnp 固定callback
    static getPathName(url) {
        const a = document.createElement('a');
        a.setAttribute('href', url);
        return a.pathname.replace(/[^a-z]/g, '_');
        // return a.pathname.replace(/\//g, '').replace(/-/g, '');
    }

    /**
     * merge 参数
     * @param httpParams
     * @param userParams
     * @returns {Promise<{}>}
     */
    static async getParams(httpParams, userParams) {
        // merger params
        let curParams = {
            ...httpParams,
            ...userParams
        };

        // transformParams:  调用前的参数转换，支持 promise 或者普通function
        try {
            if (curParams.transformParams) {
                const transParams = await curParams.transformParams(curParams);
                if (transParams) {
                    curParams = transParams;
                }
            }
        } catch (e) {
            // nothing
            console.warn('transformParams reject ..');
        }

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

        return curParams;
    }

    /**
     * 获取本地cache
     * @param curParams
     * @returns {{localCacheName: *, result: *}}
     */
    static getLocalCache(curParams) {
        const localCacheName = Service.getLocalCacheKey(curParams);
        let result;

        if (localCacheName) {
            // 正常获取key名
            try {
                const cacheData = JSON.parse(window.sessionStorage.getItem(localCacheName));
                const { lastCacheTime, result: tempResult } = cacheData;

                // 判断过期状态
                if (lastCacheTime + curParams.useLocalCache >= Math.round((+new Date()) / 1000)) {
                    result = tempResult;
                }
            } catch (e) {
                // nothing
            }
        }

        return {
            localCacheName,
            result
        };
    }

    // 更新本地cache
    static setLocalCache(localCacheName, data) {
        setTimeout(() => {
            // 设置缓存和缓存时的时间
            try {
                const result = {
                    ...data
                };
                delete result.$_response;
                window.sessionStorage.setItem(localCacheName, JSON.stringify({
                    result,
                    lastCacheTime: Math.round((+new Date()) / 1000)
                }));
            } catch (e) {
                // nothing
            }
        }, 0);
    }

    /**
     * 取消控制
     * @param curParams
     * @returns {*}
     */
    cancelContr(curParams) {
        // 第二次请求时 尝试取消第一次请求
        if (curParams.isCancel) {
            this.cancel();
        }

        // 如果 cancelToken 是用户传入，那么取消操作需要用户自行控制
        if (curParams.cancelToken) {
            return curParams.cancelToken;
        }
        this.cancelSource = http.CancelToken.source();
        return this.cancelSource.token;
    }

    // 可以对params 做最终发起http请求前的微调，引用 直接修改源数据
    preHttpCall(params) {}

    /**
     * http请求
     * @param userParams
     * @returns {Promise<*>}
     */
    async http(userParams) {
        const curParams = await Service.getParams(this.httpParams, userParams);

        // 缓存当前http promise ，多次请求同一个接口，皆返回第一次请求的数据（和接口参数无关）
        if (curParams.usePreResult && this.$preResult) return this.$preResult;

        // 本地缓存
        let localCacheName;
        if (curParams.useLocalCache > 0) {
            const { localCacheName: tempName, result } = Service.getLocalCache(curParams);
            localCacheName = tempName;
            if (result) {
                return result;
            }
        }

        // 取消操作
        const cancelToken = this.cancelContr(curParams);

        // loading 开启
        loadingStatus(curParams, 1);
        const finalHttpParams = {
            cancelToken,
            ...curParams
        };

        this.preHttpCall(finalHttpParams);
        this.$preResult = http(finalHttpParams).then((res) => {
            const resType = Object.prototype.toString.call(res.body);
            if (resType === '[object Object]') {
                if (curParams.useLocalCache) {
                    Service.setLocalCache(localCacheName, res.body);
                }

                // 默认service 会直接返回response.data中的数据，方便后续的调用
                // 原response 对象会保存在 $_response 中
                res.body.$_response = res;
                return res.body;
            }

            // blob 或者其它string 调用者自行处理
            return res;
        }).finally(() => {
            // loading 关闭
            loadingStatus(curParams, 0);

            // ...
            this.cancelSource = null;
        });

        return this.$preResult;
    }

    // 取消请求
    cancel() {
        // 这里直接取消当前Service 的前一次调用
        if (this.cancelSource) {
            this.cancelSource.cancel();
            this.cancelSource = null;
        }
    }
}

export default Service;
