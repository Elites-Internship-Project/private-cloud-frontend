const NavBar = (props) => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid justify-content-end">
        <button className="btn btn-outline-danger" type="submit">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
