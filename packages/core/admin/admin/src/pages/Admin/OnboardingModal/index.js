import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@strapi/design-system/ModalLayout';
import { Typography } from '@strapi/design-system/Typography';
import { Button } from '@strapi/design-system/Button';
import OnboardingContext from './OnboardingContext';

const shouldSkipModal = (
  section,
  step,
  currentSectionKey,
  sectionKey,
  previousPathname,
  pathname
) => {
  // Skip if no section for this page
  // console.log(step);

  if (!step || !section) {
    return true;
  };

  // Skip if section is already completed
  if (section.done) {
    return true;
  };

  // Skip if the previous page had the same section as the current
  // And if it was not the exact same page
  // if (currentSectionKey === sectionKey && previousPathname !== pathname) {
  //   return true;
  // };



  // not skip modal if step pagematcher is good

  return false;
};

const getCurrentKey = (steps, pathname) => {

  const orderedStepsKeys = Object.keys(steps)
    .sort((a, b) => steps[a].stepNumber - steps[b].stepNumber);

  const firstNotDoneKeyForCurrentPage = orderedStepsKeys
    .find(key => steps[key].done === false && pathname.match(steps[key].pageMatcher));
  
  if(!firstNotDoneKeyForCurrentPage) {
    return null;
  }

  const keysBeforeCurrentOne = orderedStepsKeys
    .filter(key => steps[key].stepNumber < steps[firstNotDoneKeyForCurrentPage].stepNumber);

  
  const allKeysBeforeCurrentAreDone = keysBeforeCurrentOne
    .reduce((acc, cur) => (acc && steps[cur].done), true);

  return allKeysBeforeCurrentAreDone && firstNotDoneKeyForCurrentPage;
}

const OnboardingModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [stepKey, setStepKey] = useState(null);
  const [sectionKey, setSectionKey] = useState(null);
  const [previousPathname, setPreviousPathname] = useState(null);
  const { onboardingState, setStepAsComplete } = useContext(OnboardingContext);
  const { pathname } = useLocation();

  useEffect(() => {
    // Get current section
    const { sections } = onboardingState;
    const currentSectionKey = Object.keys(sections).find(key =>
      pathname.includes(sections[key].page)
    );
    const section = onboardingState.sections[currentSectionKey];

    // Get the curent step
    const steps = section?.steps || {};

    const currentStepKey = getCurrentKey(steps, pathname);
    const step = steps[currentStepKey];

    // Test BEFORE updating state
    const skip = shouldSkipModal(
      section,
      step,
      currentSectionKey,
      sectionKey,
      previousPathname,
      pathname
    );
    setSectionKey(currentSectionKey);
    setPreviousPathname(pathname);

    if (skip) {
      setIsVisible(false);

      return;
    }

    setStepKey(currentStepKey);
    setCurrentStep(step);

    setIsVisible(true);

    // TO FIX LATER MISSING DEPENDENCIES
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, onboardingState]);

  const handleEndActionClick = () => {
    if (currentStep && currentStep.selfValidate) {
      setStepAsComplete(sectionKey, stepKey);
    } else {
      setIsVisible(prev => !prev);
    }
  };

  return (
    <>
      {isVisible && (
        <ModalLayout onClose={() => setIsVisible(prev => !prev)} labelledBy="title">
          <ModalHeader>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
              {currentStep?.title}
            </Typography>
          </ModalHeader>
          <ModalBody>hello world</ModalBody>
          <ModalFooter endActions={<Button onClick={handleEndActionClick}>click me</Button>} />
        </ModalLayout>
      )}
    </>
  );
};

export default OnboardingModal;
