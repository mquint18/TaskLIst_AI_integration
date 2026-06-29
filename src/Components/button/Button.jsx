

function Button({text, onClick, type = "button"}) {

    return(
    

        <button className="clicky" type = {type} onClick={onClick}>
            {text}
        </button> 
    );
}

export default Button;