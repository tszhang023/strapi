'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('cem')
      .service('myService')
      .getWelcomeMessage();
  },
};
