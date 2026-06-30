import doodle from "../../assets/doodle.png";
function Header() {
  return (
    <div className="header-box">
      <img src={doodle} alt="ToDo List" className="header-image" />
      <div className="header-text">
        <h2>To Do List</h2>
        <p>Add a task, then break it down with AI</p>
      </div>
    </div>
  );
}

export default Header;
