

function Input({value, onChange, onKeyDown, placeholder}) {

    return(

        <input 
            type="text"
            className="input"
            value = {value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
        
        />
    )
}

export default Input;