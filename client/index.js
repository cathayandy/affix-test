import dva from 'dva';
import createBrowserHistory from 'history/createBrowserHistory';
import router from './router';
import './index.less';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            }).catch(err => {
                console.err('SW registration failed: ', err);
            });
    });
}

const app = dva({
    history: createBrowserHistory(),
});
app.router(router);
app.start('#root');
