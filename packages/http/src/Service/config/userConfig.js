const config = {
    showLoading() {
        console.log('loading');
        // document.body.style.backgroundColor = 'red';
    },
    hideLoading() {
        console.log('loading end');
        // setTimeout(() => {
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

export default {
    get,
    set,
};
