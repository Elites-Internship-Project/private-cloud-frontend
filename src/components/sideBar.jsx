import { useEffect, useState } from "react";

const SideBar = (props) => {
  // eslint-disable-next-line
  const [sidebarItems, setSidebarItems] = useState([
    {
      link: "/dashboard",
      text: "Dashboard",
      isActive: true,
    },
    {
      link: "/otheritems",
      text: "Other items",
      isActive: false,
    },
  ]);

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-light"
      style={{ width: "280px", height: "100vh" }}
      bis_skin_checked="1"
    >
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
      >
        <svg className="bi pe-none me-2" width="40" height="32"></svg>
        <span className="fs-4">Web logo</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {sidebarItems.map((item, index) => (
          <li key={index} className="nav-item">
            <a
              href="#"
              className={
                item.isActive ? "nav-link active" : "nav-link link-dark"
              }
              aria-current="page"
            >
              <svg className="bi pe-none me-2" width="16" height="16"></svg>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
