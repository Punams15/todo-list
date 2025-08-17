import React from "react"
function TextInputWithLabel ({elementId, label, onChange, ref, value}) {
return (
<>
<label htmlFor={elementId}>{label}</label>
<input type = "text"
id={elementId}
ref={ref}
value={value}
onChnage={onChange}
/>

</>

)
}
export default TextInputWithLabel