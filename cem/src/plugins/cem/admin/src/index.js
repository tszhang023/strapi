import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import TranslatableText from "./components/Translatable/Text";
import TranslatableTextarea from "./components/Translatable/Textarea";
import Wysiwyg from './components/Wysiwyg';
const name = pluginPkg.strapi.name;
import ChangeLangBtn from './components/ChangeLangBtn';

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/App');

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });

    app.addFields({type:'TranslatableText',Component:TranslatableText});

    app.addFields({type:'TranslatableTextarea',Component:TranslatableTextarea});

    app.addFields({type:'CKEditor',Component:Wysiwyg});

  },

  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'cem-change-language',
      Component: ChangeLangBtn,
  });
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );


    return Promise.resolve(importedTrads);
  },
};
