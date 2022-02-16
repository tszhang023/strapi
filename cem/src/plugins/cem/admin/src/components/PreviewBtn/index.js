import React from 'react'
import { BaseButton } from '@strapi/design-system/BaseButton'
import styled from 'styled-components'
import Icon from '@strapi/icons/Layout'
// const StyledButton = styled(BaseButton)`
// width: 30%;
// display: block;
// font-size: 12px;
// font-weight: 600;
// `;

const StyledButton = styled(BaseButton)`
  width: 100%;
  height: 36px;
  color: #271fe0;
  border: 1px solid #d9d8ff;
  background: #f0f0ff;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1.33;
  display: inline-flex;

  svg {
    height: 16px;
    width: 20px;
    > path {
      fill: #271fe0;
    }
    padding-right: 8px;
  }

  :&hover  {
    background-color: #ffffff;
  }
`

const ChangeLangBtn = (props) => {
  return (
    <StyledButton
      onClick={() => {
        const previewData = { id: props.data.id, slug: props.slug }

        window.open(
          `http://localhost:3000/${props.data.id}?preview=${encodeURIComponent(
            JSON.stringify(previewData)
          )}`,
          '_blank'
        )
      }}
    >
      <Icon />
      Preview
    </StyledButton>
  )
}

export default ChangeLangBtn
