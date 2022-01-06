
import contentTypeBuilder from '../../../../packages/core/content-type-builder/strapi-admin.js';
import email from '../../../../packages/core/email/strapi-admin.js';
import upload from '../../../../packages/core/upload/strapi-admin.js';
import cem from '../../../src/plugins/cem/strapi-admin.js';
import documentation from '../../../../packages/plugins/documentation/strapi-admin.js';
import graphql from '../../../../packages/plugins/graphql/strapi-admin.js';
import i18N from '../../../../packages/plugins/i18n/strapi-admin.js';
import sentry from '../../../../packages/plugins/sentry/strapi-admin.js';
import usersPermissions from '../../../../packages/plugins/users-permissions/strapi-admin.js';


const plugins = {
  'content-type-builder': contentTypeBuilder,
  'email': email,
  'upload': upload,
  'cem': cem,
  'documentation': documentation,
  'graphql': graphql,
  'i18n': i18N,
  'sentry': sentry,
  'users-permissions': usersPermissions,
};

export default plugins;
