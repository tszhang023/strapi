'use strict';

/**
 * web-menu service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::web-menu.web-menu');
