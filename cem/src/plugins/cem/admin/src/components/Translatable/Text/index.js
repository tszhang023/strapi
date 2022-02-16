import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { TextInput } from '@strapi/design-system/TextInput';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './index.css';
import { useIntl } from 'react-intl';

const TranslatableText = ({
  description,
  disabled,
  error,
  intlLabel,
  labelAction,
  name,
  onChange,
  placeholder,
  value,
}) => {
  const { formatMessage } = useIntl();
  const [inputValue, setInputValue] = useState(
    value ? JSON.parse(value) : { cn: '', en: '', pt: '' }
  );

  let spacer = !isEmpty(description) ? <div style={{ height: '.4rem' }} /> : <div />;

  if (!isEmpty(error)) {
    spacer = <div />;
  }

  useEffect(() => {
    const newValue = JSON.stringify(inputValue);
    if (newValue) {
      onChange({ target: { name, value: newValue, type: 'string' } });
    }
  }, [inputValue]);

  const label = intlLabel.id
    ? formatMessage(
        { id: intlLabel.id, defaultMessage: intlLabel.defaultMessage },
        { ...intlLabel.values }
      )
    : name;

  const TabTitles = [];
  const LangInputSet = [
    { title: '繁體中文', name: 'cn' },
    { title: 'English', name: 'en' },
    { title: 'Português', name: 'pt' },
  ].map(lang => {
    TabTitles.push(<Tab key={lang.name}>{lang.title}</Tab>);
    return (
      <TabPanel key={lang.name}>
        <TextInput
          error={error}
          value={inputValue[lang.name]}
          onChange={({ target: { value } }) => {
            setInputValue(prevState => {
              const newValue = {};
              newValue[lang.name] = value;
              const newState = { ...prevState, ...newValue };
              return newState;
            });
          }}
          label={label}
          placeholder={intlLabel.placeholder}
          name={label}
          disabled={disabled}
          required
        />
      </TabPanel>
    );
  });

  return (
    <div
      style={{
        marginBottom: '1.6rem',
        fontSize: '0.5rem',
        fontFamily: 'Lato',
      }}
    >
      <Tabs>
        <TabList>{TabTitles}</TabList>
        {LangInputSet}
      </Tabs>

      {spacer}
    </div>
  );
};

TranslatableText.defaultProps = {
  description: null,
  disabled: true,
  error: '',
  labelAction: undefined,
  placeholder: null,
  value: '',
};

TranslatableText.propTypes = {
  description: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  }),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  intlLabel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  }).isRequired,
  labelAction: PropTypes.element,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  }),
  value: PropTypes.string,
};

export default TranslatableText;
