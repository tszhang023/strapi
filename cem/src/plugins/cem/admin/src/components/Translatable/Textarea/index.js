import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./index.css";
import TextEditor from "../../CKEditor";
import { Box, Stack, Typography } from "@strapi/design-system";
import MediaLib from "../../MediaLib";
import config from "../../../config/ckeditor";
import { prefixFileUrlWithBackendUrl, auth } from "@strapi/helper-plugin";
import { useIntl } from "react-intl";

const TranslatableTextarea = ({
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

  const [inputValue, setInputValue] = useState(value ? JSON.parse(value) : { cn: "", en: "", pt: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [editor, setEditor] = useState(null);


  let spacer = !isEmpty(description) ? (
    <div style={{ height: ".4rem" }} />
  ) : (
    <div />
  );

  if (!isEmpty(error)) {
    spacer = <div />;
  }

  // useEffect(() => {
  //   if (value) {
  //     setInputValue(JSON.parse(value));
  //   }
  // }, [value]);

  useEffect(() => {
    const newValue = JSON.stringify(inputValue);
    onChange({ target: { name, value: newValue } });
  }, [inputValue]);

  const toggleMediaLib = (editor) => {
    if (editor) {
      setEditor(editor);
    }
    setIsOpen((prev) => !prev);
  };

  const errorMessage = error
    ? formatMessage({ id: error, defaultMessage: error })
    : "";

  const label = intlLabel.id
    ? formatMessage(
        { id: intlLabel.id, defaultMessage: intlLabel.defaultMessage },
        { ...intlLabel.values }
      )
    : name;

  const handleChange = (data) => {
    if (data) {
      editor.model.change((writer) => {
        const divElement = writer.createElement("div");
        data.forEach((file) => {
          const url = prefixFileUrlWithBackendUrl(file.url);
          const imageElement = writer.createElement("image", {
            src: url,
          });
          divElement._appendChild(imageElement);
        });
        editor.model.insertContent(divElement, editor.model.document.selection);
      });
    }
    // Handle videos and other type of files by adding some code
  };

  config.strapiMediaLib = {
    onToggle: toggleMediaLib,
    label: label,
  };

  config.strapiUpload = {
    uploadUrl: `${strapi.backendURL}/upload`,
    headers: {
      Authorization: "Bearer " + auth.getToken(),
    },
  };
  
  const TabTitles = [];
  const LangInputSet = [
    { title: "繁體中文", name: "cn" },
    { title: "English", name: "en" },
    { title: "Português", name: "pt" },
  ].map((lang) => {
    TabTitles.push(<Tab key={lang.name}>{lang.title}</Tab>);
    return (
      <TabPanel key={lang.name}>
        <Stack horizontal size={1}>
          <Typography variant="pi" fontWeight="bold" textColor="neutral800">
            {label}
          </Typography>
        </Stack>
        <TextEditor
          config={config}l
          name={name + "_" + lang.name}
          onChange={({ target: { value } }) => {
            setInputValue((prevState) => {
              const newValue = {};
              newValue[lang.name] = value;
              const newState = { ...prevState, ...newValue };
              return newState;
            });
          }}
          value={inputValue[lang.name]}
        />
      </TabPanel>
    );
  });

  return (
    <div
      style={{
        marginBottom: "1.6rem",
        fontSize: "0.5rem",
        fontFamily: "Lato",
      }}
    >
      <Tabs>
        <TabList>{TabTitles}</TabList>
        {LangInputSet}
      </Tabs>
      {spacer}

      <MediaLib
        onToggle={toggleMediaLib}
        isOpen={isOpen}
        onChange={handleChange}
      />
    </div>
  );
};

TranslatableTextarea.defaultProps = {
  description: null,
  disabled: true,
  error: '',
  labelAction: undefined,
  placeholder: null,
  value: '',
};

TranslatableTextarea.propTypes = {
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


export default TranslatableTextarea;
