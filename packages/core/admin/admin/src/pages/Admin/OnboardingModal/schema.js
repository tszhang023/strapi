const initialState = {
  sections: {
    'content-type-builder': {
      number: 3,
      page: 'plugins/content-type-builder',
      done: false,
      steps: {
        'create-content-type': {
          closed: false,
          done: false,
          number: 1,
          pageMatcher: /\/plugins\/content-type-builder\/[^/]+\/[^/]+\/?$/,
          selfValidate: true,
          title: 'init CTB onboarding',
        },
        'create-content-type-success': {
          closed: false,
          done: false,
          number: 2,
          pageMatcher: /\/plugins\/content-type-builder\/.*/,
          selfValidate: true,
          title: 'success CTB onboarding',
        },
      },
    },
    'content-manager': {
      number: 1,
      page: '/content-manager',
      done: false,
      steps: {
        'create-content': {
          closed: false,
          done: false,
          number: 1,
          pageMatcher: /\/content-manager\/[^/]+\/[^/]+\/?$/,
          selfValidate: false,
          title: 'init CM onboarding',
        },
        'create-content-success': {
          closed: false,
          done: false,
          number: 2,
          pageMatcher: /\/content-manager\/.*/,
          selfValidate: true,
          title: 'success CM onboarding',
        },
      },
    },
    'api-tokens': {
      number: 2,
      page: 'settings/api-tokens',
      done: false,
      steps: {
        'create-api-tokens': {
          closed: false,
          done: false,
          number: 1,
          pageMatcher: /\/settings\/api-tokens\/?$/,
          selfValidate: false,
          title: 'init API token onboarding',
        },
        'create-api-tokens-success': {
          closed: false,
          done: false,
          number: 2,
          pageMatcher: /\/settings\/api-tokens\/.*/,
          selfValidate: true,
          title: 'success API token onboarding',
        },
      },
    },
  },
};

export default initialState;
