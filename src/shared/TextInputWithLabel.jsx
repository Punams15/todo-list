import React from "react";
import styled from "styled-components";

function TextInputWithLabel ({elementId, label, onChange, ref, value}) {
return (
<>
<StyledWrapper>
<label htmlFor={elementId}>{label}</label>
<StyledInput type = "text"
id={elementId}
ref={ref}
value={value}
onChange={onChange}
/>
</StyledWrapper>
</>

)
}
export default TextInputWithLabel

/* Styled Components */
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.3rem 0;
`;

const StyledInput = styled.input`
  padding: 0.4rem;
`;