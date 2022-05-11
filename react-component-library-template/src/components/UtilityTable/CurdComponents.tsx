import React from 'react'
import './UtilityTable.css';
function Crud_Loader() {
  return (
    <div className="crud_loader"></div>
  )
}

  function CrudField(props: any) {
    const { value, onChange, placeholder, label, type = "text", ...otherProps } = props;
    return (
        <div className="custom-field">
            <input type={type} onChange={onChange} value={value} placeholder={placeholder} {...otherProps} />
            {/* // <label htmlFor="email-field" className="placeholder">Enter Email</label> */}
        </div>
    )
}

 function CrudToolTip(props: any) {
    return (
        <div className="tooltip">{props.item}
            <span className="tooltiptext">{props.toolTipText}</span>
        </div>)
}

 function IconCrudButton(props: any) {
    const { iconName, disabled, buttonClass = "crud-icon-button ", className = "", 
    ...otherProps } = props;

    return (
        <button
            className={disabled ? buttonClass + className + " crud-disable" : buttonClass + className}
            disabled={disabled}
            {...otherProps}>
            <i className={iconName + " icons-style"}></i>
        </button>
    )
}


export {Crud_Loader, CrudField, CrudToolTip, IconCrudButton}