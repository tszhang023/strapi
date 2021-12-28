import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { usePersistentState } from '@strapi/helper-plugin';
import OnboardingContext from './OnboardingContext';
import initialState from './schema';

// TO WAIT FOR PRODUCT: Don't show modal when moving from a LV CT to another

// clean regex

// Homepage
// Onboarding mode in params

const OnboardingProvider = ({ children }) => {
  const [onboardingState, setOnboardingState] = usePersistentState(
    'onboarding-state',
    initialState
  );

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
    return updateStepProperty(sectionId, stepId, 'done', true);
  };

  const setStepAsClosed = (sectionId, stepId) => {
    return updateStepProperty(sectionId, stepId, 'closed', true);
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

// return new Promise(resolve => {
//   setOnboardingState(prev => {
//     const newState = cloneDeep(prev);
//     const section = newState.sections[sectionId];
//     const steps = section.steps;
//     const stepsKeys = Object.keys(steps);
//     section.steps[stepId][key] = value;

//     // Mark section as done if all its steps are done
//     newState.sections[sectionId].done = stepsKeys.reduce((acc, cur) => {
//       return acc && steps[cur].done;
//     }, true);

//     resolve();

//     return newState;
//   });
// });
