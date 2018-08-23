const fs = require('fs');
const Koa = require('koa');
const cors = require('kcors');
const serve = require('koa-static');
const route = require('koa-route');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const history = require('koa2-connect-history-api-fallback');

const db = {
    venchi: [],
    cathayandy: [],
};
const status = {
    venchi: true,
    cathayandy: true,
};
function dump(key) {
    console.log(`Data ${key} saving...`);
    return new Promise((resolve, reject) => {
        if (!status[key]) {
            reject(`Data ${key} busy!`);
        }
        status[key] = false;
        const res = JSON.stringify(db[key]);
        fs.writeFile(`${key}.db.json`, res, err => {
            status[key] = true;
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}
function load(key) {
    console.log(`Data ${key} reloading...`);
    if (!status[key]) {
        console.error(`Data ${key} busy!`);
        return;
    }
    status[key] = false;
    fs.readFile(`${key}.db.json`, (err, data) => {
        status[key] = true;
        if (err) {
            if (err.errno === -4058) {
                console.log(`Data ${key} does not exist! Creating one...`);
                dump(key);
            } else {
                console.error(`Data ${key} reloading failed!`);
                console.error(err);
            }
        } else {
            db[key] = JSON.parse(data);
            console.log(`Data ${key} reloaded!`);
        }
    });
}
load('cathayandy');
load('venchi');

const app = new Koa();
// x-response-time
app.use(async (ctx, next) => {
    const start = new Date();
    console.log(start);
    await next();
    const ms = new Date() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});
// cors
app.use(cors());
// bodyParser
app.use(bodyParser());
// logger
app.use(logger());
// route
app.use(route.get('/api/events', async ctx => {
    const user = ctx.request.query.user;
    ctx.body = JSON.stringify(db[user] || []);
}));
app.use(route.post('/api/events', async ctx => {
    const { user, title, count } = ctx.request.body;
    if ((user in db) && title && count) {
        db[user].push({
            title, count: +count, time: new Date().valueOf(),
        });
        const res = await dump(user);
        ctx.body = `{"success":${res}}`;
    } else {
        ctx.body = '{"success":false}';
    }
}));
app.use(route.del('/api/events', async ctx => {
    const { user, id } = ctx.request.body;
    if ((user in db) && id) {
        const target = db[user].findIndex(event => event.time === id);
        if (target) {
            db[user].splice(target, 1);
        }
        const res = await dump(user);
        ctx.body = `{"success":${res}}`;
    } else {
        ctx.body = '{"success":false}';
    }
}));
// static
app.use(history());
app.use(serve('./dist', {
    maxage: 315360000000,
}));
// response
app.listen(8080);
