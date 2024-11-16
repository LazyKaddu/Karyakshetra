import React from 'react';
import '../assets/layout.css';
import logo from "../assets/logo.png"


const Navbar = () => {
    return (
        <nav className="navbar">
            <img src={logo} alt="Logo" className="navbar-logo" />
            <ul className="navbar-nav">
                {renderDropdown("File", ["New", "Open", "Save"])}
                {renderDropdown("Edit", ["Undo", "Redo", "Cut", "Copy", "Paste"])}
                {renderDropdown("View", ["Zoom In", "Zoom Out"])}
                {renderDropdown("Navigate", ["Next", "Previous"])}
                {renderDropdown("Help", ["Documentation", "Support"])}
            </ul>
            <RunCodeExample/>
        </nav>
    );
};

const renderDropdown = (label, items) => (
    <li className="nav-item dropdown">
        <a className="nav-link" href="#">{label}</a>
        <ul className="dropdown-menu">
            {items.map(item => (
                <li key={item}>
                    <a className="dropdown-item" href="#">{item}</a>
                </li>
            ))}
        </ul>
    </li>
);

const RunCodeExample = () => {
    const runCode = (event) => {
        event.preventDefault();
        console.log("Code is running...");
        alert("Code executed!");
    };

    return (
        <form className="search-form" onSubmit={runCode}>
            <button type="submit" className="search-button">Run Code</button>
        </form>
    );
};


export default Navbar;