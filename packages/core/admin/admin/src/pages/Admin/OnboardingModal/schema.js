const initialState = {
  sections: {
    'content-type-builder': {
      number: 1,
      page: 'plugins/content-type-builder',
      done: false,
      steps: {
        'create-content-type': {
          closed: false,
          done: false,
          number: 1,
          pageMatcher: /\/plugins\/content-type-builder\/[^/]+\/[^/]+\/?$/,
          selfValidate: false,
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
      number: 2,
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
  },
};

export default initialState;
