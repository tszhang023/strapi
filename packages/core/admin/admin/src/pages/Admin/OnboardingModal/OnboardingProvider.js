import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import OnboardingContext from './OnboardingContext';

const OnboardingProvider = ({ children }) => {
  const initialState = {
    sections: {
      '/content-manager': {
        pageMatcher: /\/content-manager\/[^/]+\/[^/]+\/?$/,
        done: false,
        steps: {
          1: {
            done: false,
            title: 'init onboarding',
          },
          2: {
            done: false,
            title: 'success onboarding',
            selfValidate: true,
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
