function Button({ text, onClick, type = "button", disabled = false }) {
  return (
    <button
      className="clicky"
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {text}
    </button>
  );
}

export default Button;
