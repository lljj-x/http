/**
 * Created by Liu.Jun on 2018/12/15.
 */

// import Cancel from './Cancel';

export default class CancelTken {
    constructor(executor) {
        if (typeof executor !== 'function') {
            throw new TypeError('executor must be a function.');
        }

        // 通过该 promise 来监听取消操作
        // 这里完美的解决了 取消动作只能在异步请求发起后才能取消的问题
        let resolvePromise;
        this.promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        // 取消信息
        executor(() => {
            if (this.reason) {
                // 已取消过
                return;
            }

            // this.reason = new Cancel(message);
            resolvePromise();
        });
    }

    /**
     * 返回对象包含当前的取消方法和一个 CancelToken 的实例
     * @returns {{token: CancelTken, cancel: *}}
     */
    static source() {
        let cancel;
        const token = new CancelTken((c) => {
            cancel = c;
        });

        return {
            token,
            cancel
        };
    }
}
