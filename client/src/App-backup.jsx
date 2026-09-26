import { useState } from "react";

function App() {
    const [activePage, setActivePage] = useState("Dashboard");

    const menuItems = [
        {
            name: "Dashboard",
            icon: "🏠"
        },
        {
            name: "Books",
            icon: "📚"
        },
        {
            name: "Members",
            icon: "👥"
        },
        {
            name: "Issue Book",
            icon: "📤"
        },
        {
            name: "Return Book",
            icon: "📥"
        },
        {
            name: "Transactions",
            icon: "📋"
        }
    ];

    return (
        <div className="app">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="logo">
                    📚
                    <span>LibManage</span>
                </div>

                <p className="menu-title">MAIN MENU</p>

                <nav>
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            className={
                                activePage === item.name
                                    ? "menu-item active"
                                    : "menu-item"
                            }
                            onClick={() => setActivePage(item.name)}
                        >
                            <span className="menu-icon">
                                {item.icon}
                            </span>

                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <div className="library-info">
                        <strong>Library Management</strong>
                        <span>MERN Stack Project</span>
                    </div>
                </div>

            </aside>

            {/* Main Content */}
            <main className="main-content">

                {/* Header */}
                <header className="topbar">

                    <div>
                        <h1>{activePage}</h1>
                        <p>Library Management System</p>
                    </div>

                    <div className="admin-profile">
                        <div className="profile-icon">
                            A
                        </div>

                        <div>
                            <strong>Admin</strong>
                            <span>Library Administrator</span>
                        </div>
                    </div>

                </header>

                {/* Dashboard */}
                {activePage === "Dashboard" && (
                    <section className="dashboard">

                        <div className="welcome">
                            <div>
                                <h2>Welcome to the Library 📚</h2>

                                <p>
                                    Manage books, members, issues, returns
                                    and transactions from one place.
                                </p>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="stats-grid">

                            <div className="stat-card">
                                <div className="stat-icon blue">
                                    📚
                                </div>

                                <div>
                                    <span>Total Books</span>
                                    <h2>1</h2>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon green">
                                    📖
                                </div>

                                <div>
                                    <span>Available Books</span>
                                    <h2>1</h2>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon orange">
                                    👥
                                </div>

                                <div>
                                    <span>Total Members</span>
                                    <h2>0</h2>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon purple">
                                    📋
                                </div>

                                <div>
                                    <span>Active Issues</span>
                                    <h2>0</h2>
                                </div>
                            </div>

                        </div>

                        {/* Quick Actions */}
                        <div className="section-header">
                            <div>
                                <h2>Quick Actions</h2>
                                <p>Frequently used library operations</p>
                            </div>
                        </div>

                        <div className="quick-actions">

                            <button
                                onClick={() => setActivePage("Books")}
                                className="action-card"
                            >
                                <span>📚</span>
                                <strong>Manage Books</strong>
                                <small>
                                    Add, edit and delete books
                                </small>
                            </button>

                            <button
                                onClick={() => setActivePage("Members")}
                                className="action-card"
                            >
                                <span>👥</span>
                                <strong>Manage Members</strong>
                                <small>
                                    Add and manage library members
                                </small>
                            </button>

                            <button
                                onClick={() => setActivePage("Issue Book")}
                                className="action-card"
                            >
                                <span>📤</span>
                                <strong>Issue Book</strong>
                                <small>
                                    Issue a book to a member
                                </small>
                            </button>

                            <button
                                onClick={() => setActivePage("Return Book")}
                                className="action-card"
                            >
                                <span>📥</span>
                                <strong>Return Book</strong>
                                <small>
                                    Process returned books
                                </small>
                            </button>

                        </div>

                        {/* Recent Activity */}
                        <div className="section-header recent-header">
                            <div>
                                <h2>Recent Activity</h2>
                                <p>Latest library transactions</p>
                            </div>
                        </div>

                        <div className="empty-state">
                            <div>📋</div>

                            <h3>No transactions yet</h3>

                            <p>
                                Library issue and return transactions
                                will appear here.
                            </p>
                        </div>

                    </section>
                )}

                {/* Temporary pages */}
                {activePage !== "Dashboard" && (
                    <section className="page-placeholder">

                        <div className="placeholder-icon">
                            {menuItems.find(
                                (item) => item.name === activePage
                            )?.icon}
                        </div>

                        <h2>{activePage}</h2>

                        <p>
                            This module will be developed in the next step.
                        </p>

                        <button
                            onClick={() => setActivePage("Dashboard")}
                        >
                            ← Back to Dashboard
                        </button>

                    </section>
                )}

            </main>
        </div>
    );
}

export default App;
