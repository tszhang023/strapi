import React, { useContext } from 'react';
import { Flex } from '@strapi/design-system/Flex';
import { Stack } from '@strapi/design-system/Stack';
import { Typography } from '@strapi/design-system/Typography';
import { LinkButton } from '@strapi/design-system/LinkButton';
import OnboardingContext from './OnboardingContext';
import { getCurrentKey } from './index';

const OnboardingHome = () => {
  const { onboardingState } = useContext(OnboardingContext);
  const { sections } = onboardingState;
  const currentSectionKey = getCurrentKey(sections, () => true);

  // utils for the sort part?
  const sectionsArray = Object.keys(sections)
    .map(sectionKey => ({ ...sections[sectionKey], current: sectionKey === currentSectionKey }))
    .sort((a, b) => a.number - b.number);

  return (
    <Stack size={3}>
      {sectionsArray.map(section => (
        <Flex
          justifyContent="space-between"
          key={section.page}
          hasRadius
          padding={5}
          shadow="tableShadow"
          background="neutral0"
        >
          <Typography textColor={section.done ? 'success600' : 'danger600'}>
            {section.homepage_title}
          </Typography>
          {section.current && <LinkButton to={section.cta_action}>{section.cta_title}</LinkButton>}
        </Flex>
      ))}
    </Stack>
  );
};

export default OnboardingHome;
