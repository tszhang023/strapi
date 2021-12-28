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

const shouldSkipModal = ({ section, step }) => {
  if (!step || step.done || !section || section.done || step.closed) {
    return true;
  }

  return false;
};

// Get the onboarding step/section for the current page
export const getCurrentKey = (elements, matcher) => {
  const orderedElementsKeys = Object.keys(elements).sort(
    (a, b) => elements[a].number - elements[b].number
  );

  // Find the first step/section not done && corresponding to the matcher
  // with no step/section done before this one not corresponding to the matcher
  let foundNotDoneBefore = false;
  const firstNotDoneKeyForCurrentPage = orderedElementsKeys.find(key => {
    const isMatching =
      elements[key].done === false && matcher(elements[key]) && !foundNotDoneBefore;

    // Update the flag
    foundNotDoneBefore = elements[key].done === false;

    return isMatching;
  });

  return firstNotDoneKeyForCurrentPage;
};

const OnboardingModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [stepKey, setStepKey] = useState(null);
  const [sectionKey, setSectionKey] = useState(null);
  const { onboardingState, setStepAsComplete, setStepAsClosed } = useContext(OnboardingContext);
  const { pathname } = useLocation();

  useEffect(() => {
    // Get current section
    const { sections } = onboardingState;
    const currentSectionKey = getCurrentKey(sections, section => pathname.includes(section.page));
    const section = onboardingState.sections[currentSectionKey];

    // Get the curent step
    const steps = section?.steps || {};
    const currentStepKey = getCurrentKey(steps, step => pathname.match(step.pageMatcher));
    const step = steps[currentStepKey];

    // Test BEFORE updating state
    const skip = shouldSkipModal({
      section,
      step,
    });
    setSectionKey(currentSectionKey);

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

  const handleCloseModal = () => {
    if (currentStep && currentStep.selfValidate) {
      setStepAsComplete(sectionKey, stepKey);
    } else {
      setIsVisible(false);
    }

    setStepAsClosed(sectionKey, stepKey);
  };

  // useEffect(() => {
  //   // Homepage link === onboarding active = true
  //   // on arrive sur API Token - y a bien une modale qui doit arriver donc on laisse onboarding true
  //   // clique sur link modal qui amène à section CM
  //   //
  //   // media lib
  //   // CM === section === firstSectionNotDone
  //   if(!there firstSectionNotDone for this pathname) {
  //     setOnboardingActiveState(false)
  //   }
  // }, [pathname]);

  return (
    <>
      {isVisible && (
        <ModalLayout onClose={handleCloseModal} labelledBy="title">
          <ModalHeader>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
              {currentStep?.title}
            </Typography>
          </ModalHeader>
          <ModalBody>hello world</ModalBody>
          <ModalFooter endActions={<Button onClick={handleCloseModal}>click me</Button>} />
        </ModalLayout>
      )}
    </>
  );
};

export default OnboardingModal;
