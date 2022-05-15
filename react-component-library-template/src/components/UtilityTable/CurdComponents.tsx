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
            {iconName}
        </button>
    )
}


function Edit() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='crud-svg-icon'><path d="M0 0h24v24H0z" fill="none" /><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
    )
}
function LastPage() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='crud-svg-icon'><path d="M0 0h24v24H0V0z" fill="none" opacity=".87" /><path d="M6.29 8.11L10.18 12l-3.89 3.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L7.7 6.7c-.39-.39-1.02-.39-1.41 0-.38.39-.38 1.03 0 1.41zM17 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1z" /></svg>
    )
}
function FirstPage() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='crud-svg-icon'><path d="M24 0v24H0V0h24z" fill="none" opacity=".87" /><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41zM6 6h2v12H6V6z" /></svg>
    )
}
function Download() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" className='crud-svg-icon'><g><rect fill="none" height="24" width="24" /></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z" /></g></svg>
    )
}
function LeftArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='crud-svg-icon'><path d="M0 0h24v24H0V0z" fill="none" /><path d="M14.71 6.71c-.39-.39-1.02-.39-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41z" /></svg>
    )
}
function RightArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='crud-svg-icon'><path d="M0 0h24v24H0V0z" fill="none" /><path d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z" /></svg>
    )
}
function Plus() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='crud-svg-icon'><path d="M0 0h24v24H0V0z" fill="none" /><path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z" /></svg>
    )
}
function Close() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='crud-svg-icon'><path d="M0 0h24v24H0V0z" fill="none" /><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" /></svg>
    )
}
function Done() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='crud-svg-icon'><path d="M0 0h24v24H0V0z" fill="none" /><path d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z" /></svg>
    )
}
function Delete() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='crud-svg-icon'><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z" /></svg>
    )
}
function Upload() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" className='crud-svg-icon'><g><rect fill="none" height="24" width="24" /></g><g><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M7,9l1.41,1.41L11,7.83V16h2V7.83l2.59,2.58L17,9l-5-5L7,9z" /></g></svg>
    )
}
function Filter() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='crud-svg-icon'><path d="M0 0h24v24H0V0z" fill="none" /><path d="M11 18h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1zm4 6h10c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1z" /></svg>
    )
}
function Refresh() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='crud-svg-icon'><path d="M0 0h24v24H0V0z" fill="none" /><path d="M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z" /></svg>
    )
}

export { Crud_Loader, CrudField, CrudToolTip, IconCrudButton,Edit, LastPage, FirstPage, Download, LeftArrow, RightArrow, Plus, Close, Done, Delete, Upload, Filter, Refresh  }