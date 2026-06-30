function Button({
  text,
  onClick,
  type = "button",
  disabled = false,
  className = "btn-add",
}) {
  return (
    <button
      className={className}
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
