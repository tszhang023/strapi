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

  const [onboardingState, setOnboardingState] = useState(initialState);

  const updateStepProperty = (sectionId, stepId, key, value) => {
    setOnboardingState(prev => {
      const newState = cloneDeep(prev);
      const section = newState.sections[sectionId];
      const steps = section.steps;
      const stepsKeys = Object.keys(steps);
      section.steps[stepId][key] = value;

      // Mark section as done if all its steps are done
      newState.sections[sectionId].done = stepsKeys.reduce((acc, cur) => {
        return acc && steps[cur].done;
      }, true);

      return newState;
    });
  };

  const setStepAsComplete = (sectionId, stepId) => {
    updateStepProperty(sectionId, stepId, 'done', true);
  };

  const setStepAsClosed = (sectionId, stepId) => {
    updateStepProperty(sectionId, stepId, 'closed', true);
  };

  return (
    <OnboardingContext.Provider value={{ onboardingState, setStepAsComplete, setStepAsClosed }}>
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
