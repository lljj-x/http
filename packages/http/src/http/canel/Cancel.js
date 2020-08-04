/**
 * Created by Liu.Jun on 2018/12/15.
 * 取消时抛出的对象
 */

class Cancel {
    constructor(message) {
        this.message = message;
    }

    __CANCEL__ = true;

    toString() {
        return `Cancel${this.message || ''}`;
    }
}

export default Cancel;
