/**
 * Created by Liu.Jun on 2018/12/14.
 */

import userConfig from './config/userConfig';

let loading = null; // loading层
let loadingSock = 0;

/**
 *
 * @param config
 * @param status 1=> fetch start ; other => fetch end
 */
export function loadingStatus(config, status) {
    if (config && config.loading) {
        if (status === 1) {
            loadingSock += 1;
            if (loadingSock === 1) {
                loading = userConfig.get().showLoading();
            }
        } else {
            setTimeout(() => {
                loadingSock -= 1;
                if (loadingSock === 0) {
                    userConfig.get().hideLoading(loading);
                }
            }, 0);
        }
    }
}
