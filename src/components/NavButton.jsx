function NavButton({ icon, label, active, onClick }) {
  return (
    <button className={active ? "nav-button active" : "nav-button"} type="button" onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

export default NavButton;
