import React from "react";
import { BaseButton } from '@strapi/design-system/BaseButton';
import styled from 'styled-components';
import { Typography } from '@strapi/design-system/Typography';

const StyledButton = styled(BaseButton)`
width: 30%;
display: block;
font-size: 12px;
font-weight: 600;

}
&:hover {
  background-color: #f5f5f5;
}
`;

const StyledDiv = styled.div`
background-color: #f0f0ff;
padding: 5px;
border: 1px solid #d9d8ff;
border-radius: 5px;
color: #331fe0;
`
const StyledTitle = styled.div`
font-size: 12px;
font-weight: 600;
text-align: center;
margin-bottom: 3px;
`;

const ChangeLangBtn = (props) => {
  console.log(props);
  return(
    <StyledDiv>
      <StyledTitle>
        Switch language
      </StyledTitle>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <StyledButton type="button">
          中文
        </StyledButton>
        <StyledButton type="button">
          ENG
        </StyledButton>
        <StyledButton type="button">
          PT
        </StyledButton>
      </div>
    </StyledDiv>
  );
};

export default ChangeLangBtn;