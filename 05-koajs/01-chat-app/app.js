const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const subscribers = [];

router.get('/subscribe', async (ctx, next) => {
  const messagePromise = new Promise((resolve) => {
    subscribers.push(resolve);
  });

  const message = await messagePromise;

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  if (message) {
    subscribers.forEach((resolve) => {
      resolve(message);
    });
  }

  ctx.status = 200;
});

app.use(router.routes());

module.exports = app;
