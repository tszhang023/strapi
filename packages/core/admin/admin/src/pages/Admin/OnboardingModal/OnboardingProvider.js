import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import OnboardingContext from './OnboardingContext';

// TO WAIT FOR PRODUCT: Don't show modal when moving from a LV CT to another

// Test if or section object works for CTB and API token

// Homepage
// Onboarding mode in params

const OnboardingProvider = ({ children }) => {
  const initialState = {
    sections: {
      'content-manager': {
        number: 1,
        page: '/content-manager',
        // pageMatcher: /\/content-manager\/[^/]+\/[^/]+\/?$/,
        done: false,
        steps: {
          'create-content': {
            number: 1,
            done: false,
            pageMatcher: /\/content-manager\/[^/]+\/[^/]+\/?$/,
            selfValidate: false,
            title: 'init CM onboarding',
          },
          'create-content-success': {
            number: 2,
            done: false,
            pageMatcher: /\/content-manager\/.*/,
            selfValidate: true,
            title: 'success CM onboarding',
          },
        },
      },
    },
  };

  const [onboardingState, setOnboardingState] = useState(initialState);

  const setStepAsComplete = (sectionId, stepId) => {
    setOnboardingState(prev => {
      const newState = cloneDeep(prev);
      const section = newState.sections[sectionId];
      const steps = section.steps;
      const stepsKeys = Object.keys(steps);
      section.steps[stepId].done = true;

      newState.sections[sectionId].done = stepsKeys.reduce((acc, cur) => {
        return acc && steps[cur].done;
      }, true);

      return newState;
    });
  };

  return (
    <OnboardingContext.Provider value={{ onboardingState, setStepAsComplete }}>
      {children}
    </OnboardingContext.Provider>
  );
};

OnboardingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OnboardingProvider;

// const initialState = {
//   sections: {
//     '/content-manager': {
//       name: 'content-manager',
//       pageMatcher: /\/content-manager\/[^/]+\/[^/]+\/?$/,
//       done: false,
//       steps: {
//         1: {
//           done: false,
//           title: 'init onboarding',
//         },
//         2: {
//           done: false,
//           title: 'success onboarding',
//           selfValidate: true,
//         },
//       },
//     },
//   },
// };
