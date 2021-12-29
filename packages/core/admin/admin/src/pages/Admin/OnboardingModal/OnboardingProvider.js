import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { usePersistentState } from '@strapi/helper-plugin';
import OnboardingContext from './OnboardingContext';
import initialState from './schema';

// TODO:
// Provider in helper plugin
// Import Provider up to Providers folder
// Replace our state with simple steps
// Array of steps done in local storage

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

      const sections = Object.keys(newState.sections);
      newState.done = sections.reduce((acc, cur) => {
        return acc && newState.sections[cur].done;
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
