import '@gb/polyfill';
import http from './http/index';
import Service from './Service/index';
import serviceConfig from './Service/config/userConfig';

// 方便测试暂时保留
// window.http = http;
// window.Service = Service;
// window.serviceConfig = serviceConfig;

export {
    http,
    Service,
    serviceConfig,
};
