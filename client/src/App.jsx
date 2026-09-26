import { useEffect, useState } from "react";

// =====================================================
// DEPLOYED BACKEND API
// =====================================================

const API_URL =
    "https://library-management-system-7zgz.onrender.com/api/books";

const MEMBERS_API_URL =
    "https://library-management-system-7zgz.onrender.com/api/members";

const ISSUES_API_URL =
    "https://library-management-system-7zgz.onrender.com/api/issues";

function App() {
    const [activePage, setActivePage] = useState("Dashboard");

    // =====================================================
    // BOOKS STATE
    // =====================================================

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showBookForm, setShowBookForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    const [search, setSearch] = useState("");
    const [bookCategoryFilter, setBookCategoryFilter] = useState("All");
    const [bookAvailabilityFilter, setBookAvailabilityFilter] =
        useState("All");

    const [bookForm, setBookForm] = useState({
        title: "",
        author: "",
        category: "",
        isbn: "",
        quantity: 1
    });

    // =====================================================
    // MEMBERS STATE
    // =====================================================

    const [members, setMembers] = useState([]);
    const [memberLoading, setMemberLoading] = useState(false);

    const [showMemberForm, setShowMemberForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const [memberSearch, setMemberSearch] = useState("");

    const [memberForm, setMemberForm] = useState({
        name: "",
        email: "",
        phone: "",
        membershipId: ""
    });

    // =====================================================
    // ISSUE STATE
    // =====================================================

    const [issues, setIssues] = useState([]);
    const [issueLoading, setIssueLoading] = useState(false);

    const [issueForm, setIssueForm] = useState({
        memberId: "",
        bookId: "",
        issueDate: "",
        dueDate: ""
    });

    const [issuingBook, setIssuingBook] = useState(false);

    // =====================================================
    // RETURN STATE
    // =====================================================

    const [returningBook, setReturningBook] = useState(false);

    // =====================================================
    // TRANSACTION SEARCH / FILTER
    // =====================================================

    const [transactionSearch, setTransactionSearch] = useState("");
    const [transactionStatusFilter, setTransactionStatusFilter] =
        useState("All");

    // =====================================================
    // MENU
    // =====================================================

    const menuItems = [
        { name: "Dashboard", icon: "🏠" },
        { name: "Books", icon: "📚" },
        { name: "Members", icon: "👥" },
        { name: "Issue Book", icon: "📤" },
        { name: "Return Book", icon: "📥" },
        { name: "Transactions", icon: "📋" }
    ];

    // =====================================================
    // FETCH BOOKS
    // =====================================================

    const fetchBooks = async () => {
        try {
            setLoading(true);

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load books");
            }

            const data = await response.json();

            setBooks(data);
        } catch (error) {
            console.error(error);

            alert(
                "Unable to load books. Make sure the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FETCH MEMBERS
    // =====================================================

    const fetchMembers = async () => {
        try {
            setMemberLoading(true);

            const response = await fetch(MEMBERS_API_URL);

            if (!response.ok) {
                throw new Error("Failed to load members");
            }

            const data = await response.json();

            setMembers(data);
        } catch (error) {
            console.error(error);

            alert(
                "Unable to load members. Make sure the backend is running."
            );
        } finally {
            setMemberLoading(false);
        }
    };

    // =====================================================
    // FETCH ISSUES
    // =====================================================

    const fetchIssues = async () => {
        try {
            setIssueLoading(true);

            const response = await fetch(ISSUES_API_URL);

            if (!response.ok) {
                throw new Error("Failed to load transactions");
            }

            const data = await response.json();

            setIssues(data);
        } catch (error) {
            console.error(error);

            alert(
                "Unable to load transactions. Make sure the backend is running."
            );
        } finally {
            setIssueLoading(false);
        }
    };

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        if (activePage === "Dashboard") {
            fetchBooks();
            fetchMembers();
            fetchIssues();
        }

        if (activePage === "Books") {
            fetchBooks();
        }

        if (activePage === "Members") {
            fetchMembers();
        }

        if (activePage === "Issue Book") {
            fetchBooks();
            fetchMembers();
            fetchIssues();
        }

        if (activePage === "Return Book") {
            fetchBooks();
            fetchMembers();
            fetchIssues();
        }

        if (activePage === "Transactions") {
            fetchIssues();
        }
    }, [activePage]);

    // =====================================================
    // BOOK INPUT
    // =====================================================

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setBookForm({
            ...bookForm,
            [name]: value
        });
    };

    // =====================================================
    // ADD BOOK
    // =====================================================

    const openAddBook = () => {
        setEditingBook(null);

        setBookForm({
            title: "",
            author: "",
            category: "",
            isbn: "",
            quantity: 1
        });

        setShowBookForm(true);
    };

    // =====================================================
    // EDIT BOOK
    // =====================================================

    const openEditBook = (book) => {
        setEditingBook(book);

        setBookForm({
            title: book.title || "",
            author: book.author || "",
            category: book.category || "",
            isbn: book.isbn || "",
            quantity: book.quantity || 1
        });

        setShowBookForm(true);
    };

    // =====================================================
    // SAVE / UPDATE BOOK
    // =====================================================

    const handleBookSubmit = async (e) => {
        e.preventDefault();

        try {
            const bookData = {
                title: bookForm.title,
                author: bookForm.author,
                category: bookForm.category,
                isbn: bookForm.isbn,
                quantity: Number(bookForm.quantity)
            };

            let response;

            if (editingBook) {
                response = await fetch(
                    `${API_URL}/${editingBook._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(bookData)
                    }
                );
            } else {
                response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bookData)
                });
            }

            if (!response.ok) {
                throw new Error("Book operation failed");
            }

            alert(
                editingBook
                    ? "Book updated successfully!"
                    : "Book added successfully!"
            );

            setShowBookForm(false);
            setEditingBook(null);

            await fetchBooks();
        } catch (error) {
            console.error(error);

            alert("Unable to save book.");
        }
    };

    // =====================================================
    // DELETE BOOK
    // =====================================================

    const deleteBook = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            alert("Book deleted successfully!");

            await fetchBooks();
        } catch (error) {
            console.error(error);

            alert("Unable to delete book.");
        }
    };

    // =====================================================
    // MEMBER INPUT
    // =====================================================

    const handleMemberInputChange = (e) => {
        const { name, value } = e.target;

        setMemberForm({
            ...memberForm,
            [name]: value
        });
    };

    // =====================================================
    // ADD MEMBER
    // =====================================================

    const openAddMember = () => {
        setEditingMember(null);

        setMemberForm({
            name: "",
            email: "",
            phone: "",
            membershipId: ""
        });

        setShowMemberForm(true);
    };

    // =====================================================
    // EDIT MEMBER
    // =====================================================

    const editMember = (member) => {
        setEditingMember(member);

        setMemberForm({
            name: member.name || "",
            email: member.email || "",
            phone: member.phone || "",
            membershipId: member.membershipId || ""
        });

        setShowMemberForm(true);
    };

    // =====================================================
    // SAVE / UPDATE MEMBER
    // =====================================================

    const saveMember = async (e) => {
        e.preventDefault();

        if (
            !memberForm.name ||
            !memberForm.email ||
            !memberForm.phone ||
            !memberForm.membershipId
        ) {
            alert("Please fill all member details.");
            return;
        }

        try {
            const memberData = {
                name: memberForm.name,
                email: memberForm.email,
                phone: memberForm.phone,
                membershipId: memberForm.membershipId
            };

            let response;

            if (editingMember) {
                response = await fetch(
                    `${MEMBERS_API_URL}/${editingMember._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(memberData)
                    }
                );
            } else {
                response = await fetch(
                    MEMBERS_API_URL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(memberData)
                    }
                );
            }

            if (!response.ok) {
                throw new Error("Member operation failed");
            }

            alert(
                editingMember
                    ? "Member updated successfully!"
                    : "Member added successfully!"
            );

            setShowMemberForm(false);
            setEditingMember(null);

            setMemberForm({
                name: "",
                email: "",
                phone: "",
                membershipId: ""
            });

            await fetchMembers();
        } catch (error) {
            console.error(error);

            alert("Unable to save member.");
        }
    };

    // =====================================================
    // DELETE MEMBER
    // =====================================================

    const deleteMember = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this member?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `${MEMBERS_API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            alert("Member deleted successfully!");

            await fetchMembers();
        } catch (error) {
            console.error(error);

            alert("Unable to delete member.");
        }
    };

    // =====================================================
    // ISSUE INPUT
    // =====================================================

    const handleIssueInputChange = (e) => {
        const { name, value } = e.target;

        setIssueForm({
            ...issueForm,
            [name]: value
        });
    };

    // =====================================================
    // ISSUE BOOK
    // =====================================================

    const issueBook = async (e) => {
        e.preventDefault();

        if (
            !issueForm.memberId ||
            !issueForm.bookId ||
            !issueForm.issueDate ||
            !issueForm.dueDate
        ) {
            alert("Please fill all issue details.");
            return;
        }

        if (
            new Date(issueForm.dueDate) <
            new Date(issueForm.issueDate)
        ) {
            alert("Due date cannot be before issue date.");
            return;
        }

        try {
            setIssuingBook(true);

            const response = await fetch(
                ISSUES_API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(issueForm)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to issue book"
                );
            }

            alert("Book issued successfully!");

            setIssueForm({
                memberId: "",
                bookId: "",
                issueDate: "",
                dueDate: ""
            });

            await fetchIssues();
            await fetchBooks();
        } catch (error) {
            console.error(error);

            alert(
                error.message ||
                "Unable to issue book."
            );
        } finally {
            setIssuingBook(false);
        }
    };

    // =====================================================
    // RETURN BOOK
    // =====================================================

    const returnBook = async (issueId) => {
        if (!issueId) {
            alert("Invalid issue record.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to return this book?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setReturningBook(true);

            const response = await fetch(
                `${ISSUES_API_URL}/return/${issueId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to return book"
                );
            }

            const returnedIssue = data.issue;

            const overdueDays =
                returnedIssue?.overdueDays || 0;

            const fine =
                returnedIssue?.fine || 0;

            const returnDate =
                returnedIssue?.returnDate
                    ? new Date(
                        returnedIssue.returnDate
                    ).toLocaleDateString()
                    : new Date().toLocaleDateString();

            alert(
                `Book returned successfully!\n\n` +
                `Return Date: ${returnDate}\n` +
                `Overdue Days: ${overdueDays}\n` +
                `Fine: ₹${fine}`
            );

            await fetchIssues();
            await fetchBooks();
        } catch (error) {
            console.error(
                "Return book error:",
                error
            );

            alert(
                error.message ||
                "Unable to return book. Make sure the backend is running."
            );
        } finally {
            setReturningBook(false);
        }
    };

    // =====================================================
    // BOOK CATEGORIES
    // =====================================================

    const categories = [
        "All",
        ...new Set(
            books
                .map((book) => book.category)
                .filter(Boolean)
        )
    ];

    // =====================================================
    // FILTERED BOOKS
    // =====================================================

    const filteredBooks = books.filter((book) => {
        const searchText =
            search.toLowerCase().trim();

        const matchesSearch =
            !searchText ||
            book.title?.toLowerCase().includes(searchText) ||
            book.author?.toLowerCase().includes(searchText) ||
            book.category?.toLowerCase().includes(searchText) ||
            book.isbn?.toLowerCase().includes(searchText);

        const matchesCategory =
            bookCategoryFilter === "All" ||
            book.category === bookCategoryFilter;

        const availableQuantity =
            Number(book.availableQuantity || 0);

        const matchesAvailability =
            bookAvailabilityFilter === "All" ||
            (
                bookAvailabilityFilter === "Available" &&
                availableQuantity > 0
            ) ||
            (
                bookAvailabilityFilter === "Issued" &&
                availableQuantity === 0
            );

        return (
            matchesSearch &&
            matchesCategory &&
            matchesAvailability
        );
    });

    // =====================================================
    // FILTERED MEMBERS
    // =====================================================

    const filteredMembers = members.filter((member) => {
        const searchText =
            memberSearch.toLowerCase().trim();

        return (
            !searchText ||
            member.name?.toLowerCase().includes(searchText) ||
            member.email?.toLowerCase().includes(searchText) ||
            member.phone?.toLowerCase().includes(searchText) ||
            member.membershipId?.toLowerCase().includes(searchText)
        );
    });

    // =====================================================
    // FILTERED TRANSACTIONS
    // =====================================================

    const filteredTransactions = issues.filter((issue) => {
        const searchText =
            transactionSearch.toLowerCase().trim();

        const member = issue.memberId;
        const book = issue.bookId;

        const matchesSearch =
            !searchText ||
            member?.name?.toLowerCase().includes(searchText) ||
            member?.membershipId?.toLowerCase().includes(searchText) ||
            book?.title?.toLowerCase().includes(searchText) ||
            book?.author?.toLowerCase().includes(searchText);

        const matchesStatus =
            transactionStatusFilter === "All" ||
            issue.status === transactionStatusFilter;

        return (
            matchesSearch &&
            matchesStatus
        );
    });

    // =====================================================
    // AVAILABLE BOOKS
    // =====================================================

    const availableBooksList = books.filter(
        (book) =>
            Number(book.availableQuantity || 0) > 0
    );

    // =====================================================
    // ACTIVE ISSUES
    // =====================================================

    const activeIssues = issues.filter(
        (issue) =>
            issue.status === "Issued" ||
            issue.status === "Overdue"
    );

    // =====================================================
    // DASHBOARD VALUES
    // =====================================================

    const totalBooks = books.reduce(
        (total, book) =>
            total + Number(book.quantity || 0),
        0
    );

    const availableBooks = books.reduce(
        (total, book) =>
            total + Number(book.availableQuantity || 0),
        0
    );

    const currentlyIssued =
        activeIssues.length;

    const overdueBooks =
        issues.filter(
            (issue) =>
                issue.status === "Overdue"
        ).length;

    const totalFine =
        issues.reduce(
            (total, issue) =>
                total + Number(issue.fine || 0),
            0
        );

    const recentTransactions =
        [...issues]
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt || b.issueDate
                    ) -
                    new Date(
                        a.createdAt || a.issueDate
                    )
            )
            .slice(0, 5);

    // =====================================================
    // RETURN JSX
    // =====================================================

    return (
        <div className="app">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="logo">
                    📚
                    <span>LibManage</span>
                </div>

                <p className="menu-title">
                    MAIN MENU
                </p>

                <nav>

                    {menuItems.map((item) => (

                        <button
                            key={item.name}
                            className={
                                activePage === item.name
                                    ? "menu-item active"
                                    : "menu-item"
                            }
                            onClick={() =>
                                setActivePage(item.name)
                            }
                        >

                            <span className="menu-icon">
                                {item.icon}
                            </span>

                            <span>
                                {item.name}
                            </span>

                        </button>

                    ))}

                </nav>

                <div className="sidebar-bottom">

                    <div className="library-info">

                        <strong>
                            Library Management
                        </strong>

                        <span>
                            MERN Stack Project
                        </span>

                    </div>

                </div>

            </aside>

            {/* MAIN CONTENT */}

            <main className="main-content">

                {/* HEADER */}

                <header className="topbar">

                    <div>

                        <h1>
                            {activePage}
                        </h1>

                        <p>
                            Library Management System
                        </p>

                    </div>

                    <div className="admin-profile">

                        <div className="profile-icon">
                            A
                        </div>

                        <div>

                            <strong>
                                Admin
                            </strong>

                            <span>
                                Library Administrator
                            </span>

                        </div>

                    </div>

                </header>

                {/* DASHBOARD */}

                {activePage === "Dashboard" && (

                    <section className="dashboard">

                        <div className="welcome">

                            <div>

                                <h2>
                                    Welcome to the Library 📚
                                </h2>

                                <p>
                                    Manage books, members, issues,
                                    returns and transactions from one place.
                                </p>

                            </div>

                        </div>

                        <div className="stats-grid">

                            <div className="stat-card">

                                <div className="stat-icon blue">
                                    📚
                                </div>

                                <div>

                                    <span>
                                        Total Books
                                    </span>

                                    <h2>
                                        {totalBooks}
                                    </h2>

                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon green">
                                    📖
                                </div>

                                <div>

                                    <span>
                                        Available Books
                                    </span>

                                    <h2>
                                        {availableBooks}
                                    </h2>

                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon purple">
                                    📤
                                </div>

                                <div>

                                    <span>
                                        Currently Issued
                                    </span>

                                    <h2>
                                        {currentlyIssued}
                                    </h2>

                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon orange">
                                    ⚠️
                                </div>

                                <div>

                                    <span>
                                        Overdue Books
                                    </span>

                                    <h2>
                                        {overdueBooks}
                                    </h2>

                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon blue">
                                    👥
                                </div>

                                <div>

                                    <span>
                                        Total Members
                                    </span>

                                    <h2>
                                        {members.length}
                                    </h2>

                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon purple">
                                    💰
                                </div>

                                <div>

                                    <span>
                                        Total Fine
                                    </span>

                                    <h2>
                                        ₹{totalFine}
                                    </h2>

                                </div>

                            </div>

                        </div>

                        <div className="section-header">

                            <div>

                                <h2>
                                    Quick Actions
                                </h2>

                                <p>
                                    Frequently used library operations
                                </p>

                            </div>

                        </div>

                        <div className="quick-actions">

                            <button
                                onClick={() =>
                                    setActivePage("Books")
                                }
                                className="action-card"
                            >

                                <span>
                                    📚
                                </span>

                                <strong>
                                    Manage Books
                                </strong>

                                <small>
                                    Add, edit and delete books
                                </small>

                            </button>

                            <button
                                onClick={() =>
                                    setActivePage("Members")
                                }
                                className="action-card"
                            >

                                <span>
                                    👥
                                </span>

                                <strong>
                                    Manage Members
                                </strong>

                                <small>
                                    Add and manage library members
                                </small>

                            </button>

                            <button
                                onClick={() =>
                                    setActivePage("Issue Book")
                                }
                                className="action-card"
                            >

                                <span>
                                    📤
                                </span>

                                <strong>
                                    Issue Book
                                </strong>

                                <small>
                                    Issue a book to a member
                                </small>

                            </button>

                            <button
                                onClick={() =>
                                    setActivePage("Return Book")
                                }
                                className="action-card"
                            >

                                <span>
                                    📥
                                </span>

                                <strong>
                                    Return Book
                                </strong>

                                <small>
                                    Process returned books
                                </small>

                            </button>

                        </div>

                        <div className="section-header recent-header">

                            <div>

                                <h2>
                                    Recent Activity
                                </h2>

                                <p>
                                    Latest library transactions
                                </p>

                            </div>

                            <button
                                className="refresh-button"
                                onClick={() => {
                                    fetchBooks();
                                    fetchMembers();
                                    fetchIssues();
                                }}
                            >
                                ↻ Refresh
                            </button>

                        </div>

                        {recentTransactions.length === 0 ? (

                            <div className="empty-state">

                                <div>
                                    📋
                                </div>

                                <h3>
                                    No transactions yet
                                </h3>

                                <p>
                                    Library issue and return transactions
                                    will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="books-table-container">

                                <table>

                                    <thead>

                                        <tr>
                                            <th>#</th>
                                            <th>Member</th>
                                            <th>Book</th>
                                            <th>Issue Date</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                            <th>Fine</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {recentTransactions.map(
                                            (issue, index) => {

                                                const member =
                                                    issue.memberId;

                                                const book =
                                                    issue.bookId;

                                                return (

                                                    <tr
                                                        key={issue._id}
                                                    >

                                                        <td>
                                                            {index + 1}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {member?.name ||
                                                                    "Unknown Member"}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {book?.title ||
                                                                "Unknown Book"}
                                                        </td>

                                                        <td>
                                                            {issue.issueDate
                                                                ? new Date(
                                                                    issue.issueDate
                                                                ).toLocaleDateString()
                                                                : "-"}
                                                        </td>

                                                        <td>
                                                            {issue.dueDate
                                                                ? new Date(
                                                                    issue.dueDate
                                                                ).toLocaleDateString()
                                                                : "-"}
                                                        </td>

                                                        <td>

                                                            <span
                                                                className={
                                                                    issue.status === "Returned"
                                                                        ? "category-badge"
                                                                        : issue.status === "Overdue"
                                                                            ? "overdue-badge"
                                                                            : "available-badge"
                                                                }
                                                            >
                                                                {issue.status}
                                                            </span>

                                                        </td>

                                                        <td>
                                                            <strong>
                                                                ₹{issue.fine || 0}
                                                            </strong>
                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                )}

                {/* BOOKS */}

                {activePage === "Books" && (

                    <section className="books-page">

                        <div className="page-heading">

                            <div>

                                <h2>
                                    Book Management
                                </h2>

                                <p>
                                    Manage all books in the library
                                </p>

                            </div>

                            <button
                                className="add-book-button"
                                onClick={openAddBook}
                            >
                                + Add Book
                            </button>

                        </div>

                        <div className="books-toolbar">

                            <input
                                type="text"
                                placeholder="🔍 Search title, author, category or ISBN..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                            <select
                                value={bookCategoryFilter}
                                onChange={(e) =>
                                    setBookCategoryFilter(
                                        e.target.value
                                    )
                                }
                            >

                                {categories.map(
                                    (category) => (

                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category === "All"
                                                ? "All Categories"
                                                : category}
                                        </option>

                                    )
                                )}

                            </select>

                            <select
                                value={bookAvailabilityFilter}
                                onChange={(e) =>
                                    setBookAvailabilityFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="All">
                                    All Availability
                                </option>

                                <option value="Available">
                                    Available
                                </option>

                                <option value="Issued">
                                    Fully Issued
                                </option>

                            </select>

                            <button
                                className="refresh-button"
                                onClick={fetchBooks}
                            >
                                ↻ Refresh
                            </button>

                        </div>

                        <div className="books-table-container">

                            {loading ? (

                                <div className="loading">
                                    Loading books...
                                </div>

                            ) : filteredBooks.length === 0 ? (

                                <div className="no-books">

                                    <div>
                                        📚
                                    </div>

                                    <h3>
                                        No books found
                                    </h3>

                                    <p>
                                        No books match your search or filter.
                                    </p>

                                    <button
                                        onClick={openAddBook}
                                        className="add-book-button"
                                    >
                                        + Add Book
                                    </button>

                                </div>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Author</th>
                                            <th>Category</th>
                                            <th>ISBN</th>
                                            <th>Quantity</th>
                                            <th>Available</th>
                                            <th>Actions</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredBooks.map(
                                            (book, index) => (

                                                <tr
                                                    key={book._id}
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {book.title}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {book.author}
                                                    </td>

                                                    <td>

                                                        <span className="category-badge">
                                                            {book.category}
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {book.isbn}
                                                    </td>

                                                    <td>
                                                        {book.quantity}
                                                    </td>

                                                    <td>

                                                        <span className="available-badge">
                                                            {book.availableQuantity}
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="table-actions">

                                                            <button
                                                                className="edit-button"
                                                                onClick={() =>
                                                                    openEditBook(
                                                                        book
                                                                    )
                                                                }
                                                            >
                                                                ✏️
                                                            </button>

                                                            <button
                                                                className="delete-button"
                                                                onClick={() =>
                                                                    deleteBook(
                                                                        book._id
                                                                    )
                                                                }
                                                            >
                                                                🗑️
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            )}

                        </div>

                        {showBookForm && (

                            <div className="modal-overlay">

                                <div className="book-modal">

                                    <div className="modal-header">

                                        <div>

                                            <h2>
                                                {editingBook
                                                    ? "Edit Book"
                                                    : "Add New Book"}
                                            </h2>

                                            <p>
                                                Enter the book details below
                                            </p>

                                        </div>

                                        <button
                                            className="close-button"
                                            onClick={() =>
                                                setShowBookForm(false)
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>

                                    <form
                                        onSubmit={handleBookSubmit}
                                        className="book-form"
                                    >

                                        <label>
                                            Book Title

                                            <input
                                                type="text"
                                                name="title"
                                                value={bookForm.title}
                                                onChange={
                                                    handleInputChange
                                                }
                                                placeholder="Enter book title"
                                                required
                                            />
                                        </label>

                                        <label>
                                            Author

                                            <input
                                                type="text"
                                                name="author"
                                                value={bookForm.author}
                                                onChange={
                                                    handleInputChange
                                                }
                                                placeholder="Enter author name"
                                                required
                                            />
                                        </label>

                                        <label>
                                            Category

                                            <input
                                                type="text"
                                                name="category"
                                                value={
                                                    bookForm.category
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                placeholder="Example: Engineering"
                                                required
                                            />
                                        </label>

                                        <label>
                                            ISBN

                                            <input
                                                type="text"
                                                name="isbn"
                                                value={bookForm.isbn}
                                                onChange={
                                                    handleInputChange
                                                }
                                                placeholder="Enter ISBN"
                                                required
                                            />
                                        </label>

                                        <label>
                                            Quantity

                                            <input
                                                type="number"
                                                name="quantity"
                                                min="1"
                                                value={
                                                    bookForm.quantity
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                required
                                            />
                                        </label>

                                        <div className="form-buttons">

                                            <button
                                                type="button"
                                                className="cancel-button"
                                                onClick={() =>
                                                    setShowBookForm(false)
                                                }
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                className="save-button"
                                            >
                                                {editingBook
                                                    ? "Update Book"
                                                    : "Save Book"}
                                            </button>

                                        </div>

                                    </form>

                                </div>

                            </div>

                        )}

                    </section>

                )}

                {/* MEMBERS */}

                {activePage === "Members" && (

                    <section className="books-page">

                        <div className="page-heading">

                            <div>

                                <h2>
                                    Member Management
                                </h2>

                                <p>
                                    Manage all library members
                                </p>

                            </div>

                            <button
                                className="add-book-button"
                                onClick={openAddMember}
                            >
                                + Add Member
                            </button>

                        </div>

                        <div className="books-toolbar">

                            <input
                                type="text"
                                placeholder="🔍 Search name, email, phone or membership ID..."
                                value={memberSearch}
                                onChange={(e) =>
                                    setMemberSearch(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                className="refresh-button"
                                onClick={fetchMembers}
                            >
                                ↻ Refresh
                            </button>

                        </div>

                        <div className="books-table-container">

                            {memberLoading ? (

                                <div className="loading">
                                    Loading members...
                                </div>

                            ) : filteredMembers.length === 0 ? (

                                <div className="no-books">

                                    <div>
                                        👥
                                    </div>

                                    <h3>
                                        No members found
                                    </h3>

                                    <p>
                                        No members match your search.
                                    </p>

                                    <button
                                        onClick={openAddMember}
                                        className="add-book-button"
                                    >
                                        + Add Member
                                    </button>

                                </div>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Membership ID</th>
                                            <th>Actions</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredMembers.map(
                                            (member, index) => (

                                                <tr
                                                    key={member._id}
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {member.name}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {member.email}
                                                    </td>

                                                    <td>
                                                        {member.phone}
                                                    </td>

                                                    <td>
                                                        {member.membershipId}
                                                    </td>

                                                    <td>

                                                        <div className="table-actions">

                                                            <button
                                                                className="edit-button"
                                                                onClick={() =>
                                                                    editMember(
                                                                        member
                                                                    )
                                                                }
                                                            >
                                                                ✏️
                                                            </button>

                                                            <button
                                                                className="delete-button"
                                                                onClick={() =>
                                                                    deleteMember(
                                                                        member._id
                                                                    )
                                                                }
                                                            >
                                                                🗑️
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            )}

                        </div>

                        {showMemberForm && (

                            <div className="modal-overlay">

                                <div className="book-modal">

                                    <div className="modal-header">

                                        <div>

                                            <h2>
                                                {editingMember
                                                    ? "Edit Member"
                                                    : "Add New Member"}
                                            </h2>

                                            <p>
                                                Enter the member details below
                                            </p>

                                        </div>

                                        <button
                                            className="close-button"
                                            onClick={() =>
                                                setShowMemberForm(false)
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>

                                    <form
                                        onSubmit={saveMember}
                                        className="book-form"
                                    >

                                        <label>
                                            Member Name

                                            <input
                                                type="text"
                                                name="name"
                                                value={memberForm.name}
                                                onChange={
                                                    handleMemberInputChange
                                                }
                                                placeholder="Enter member name"
                                                required
                                            />
                                        </label>

                                        <label>
                                            Email

                                            <input
                                                type="email"
                                                name="email"
                                                value={memberForm.email}
                                                onChange={
                                                    handleMemberInputChange
                                                }
                                                placeholder="Enter email address"
                                                required
                                            />
                                        </label>

                                        <label>
                                            Phone Number

                                            <input
                                                type="text"
                                                name="phone"
                                                value={memberForm.phone}
                                                onChange={
                                                    handleMemberInputChange
                                                }
                                                placeholder="Enter phone number"
                                                required
                                            />
                                        </label>

                                        <label>
                                            Membership ID

                                            <input
                                                type="text"
                                                name="membershipId"
                                                value={
                                                    memberForm.membershipId
                                                }
                                                onChange={
                                                    handleMemberInputChange
                                                }
                                                placeholder="Example: MEM001"
                                                required
                                            />
                                        </label>

                                        <div className="form-buttons">

                                            <button
                                                type="button"
                                                className="cancel-button"
                                                onClick={() => {

                                                    setShowMemberForm(false);
                                                    setEditingMember(null);

                                                }}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                className="save-button"
                                            >
                                                {editingMember
                                                    ? "Update Member"
                                                    : "Save Member"}
                                            </button>

                                        </div>

                                    </form>

                                </div>

                            </div>

                        )}

                    </section>

                )}

                {/* ISSUE BOOK */}

                {activePage === "Issue Book" && (

                    <section className="books-page">

                        <div className="page-heading">

                            <div>

                                <h2>
                                    Issue Book
                                </h2>

                                <p>
                                    Issue a library book to a member
                                </p>

                            </div>

                            <button
                                className="refresh-button"
                                onClick={() => {
                                    fetchBooks();
                                    fetchMembers();
                                    fetchIssues();
                                }}
                            >
                                ↻ Refresh
                            </button>

                        </div>

                        <div className="book-modal issue-form-container">

                            <div className="modal-header">

                                <div>

                                    <h2>
                                        📤 Issue a Book
                                    </h2>

                                    <p>
                                        Select a member and an available book
                                    </p>

                                </div>

                            </div>

                            <form
                                onSubmit={issueBook}
                                className="book-form"
                            >

                                <label>
                                    Select Member

                                    <select
                                        name="memberId"
                                        value={issueForm.memberId}
                                        onChange={
                                            handleIssueInputChange
                                        }
                                        required
                                    >

                                        <option value="">
                                            -- Select Member --
                                        </option>

                                        {members.map(
                                            (member) => (

                                                <option
                                                    key={member._id}
                                                    value={member._id}
                                                >
                                                    {member.name} -
                                                    {member.membershipId}
                                                </option>

                                            )
                                        )}

                                    </select>
                                </label>

                                <label>
                                    Select Book

                                    <select
                                        name="bookId"
                                        value={issueForm.bookId}
                                        onChange={
                                            handleIssueInputChange
                                        }
                                        required
                                    >

                                        <option value="">
                                            -- Select Available Book --
                                        </option>

                                        {availableBooksList.map(
                                            (book) => (

                                                <option
                                                    key={book._id}
                                                    value={book._id}
                                                >
                                                    {book.title} -
                                                    Available:{" "}
                                                    {book.availableQuantity}
                                                </option>

                                            )
                                        )}

                                    </select>
                                </label>

                                <label>
                                    Issue Date

                                    <input
                                        type="date"
                                        name="issueDate"
                                        value={
                                            issueForm.issueDate
                                        }
                                        onChange={
                                            handleIssueInputChange
                                        }
                                        required
                                    />
                                </label>

                                <label>
                                    Due Date

                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={
                                            issueForm.dueDate
                                        }
                                        onChange={
                                            handleIssueInputChange
                                        }
                                        required
                                    />
                                </label>

                                <div className="form-buttons">

                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => {

                                            setIssueForm({
                                                memberId: "",
                                                bookId: "",
                                                issueDate: "",
                                                dueDate: ""
                                            });

                                        }}
                                    >
                                        Clear
                                    </button>

                                    <button
                                        type="submit"
                                        className="save-button"
                                        disabled={issuingBook}
                                    >
                                        {issuingBook
                                            ? "Issuing..."
                                            : "📤 Issue Book"}
                                    </button>

                                </div>

                            </form>

                        </div>

                        <div className="section-header recent-header">

                            <div>

                                <h2>
                                    Issued Books
                                </h2>

                                <p>
                                    Books currently issued to library members
                                </p>

                            </div>

                        </div>

                        <div className="books-table-container">

                            {issueLoading ? (

                                <div className="loading">
                                    Loading issued books...
                                </div>

                            ) : activeIssues.length === 0 ? (

                                <div className="no-books">

                                    <div>
                                        📤
                                    </div>

                                    <h3>
                                        No issued books
                                    </h3>

                                    <p>
                                        Books currently issued will appear here.
                                    </p>

                                </div>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>
                                            <th>#</th>
                                            <th>Member</th>
                                            <th>Membership ID</th>
                                            <th>Book</th>
                                            <th>Issue Date</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {activeIssues.map(
                                            (issue, index) => {

                                                const member =
                                                    issue.memberId;

                                                const book =
                                                    issue.bookId;

                                                return (

                                                    <tr
                                                        key={issue._id}
                                                    >

                                                        <td>
                                                            {index + 1}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {member?.name ||
                                                                    "Unknown Member"}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {member?.membershipId ||
                                                                "-"}
                                                        </td>

                                                        <td>
                                                            {book?.title ||
                                                                "Unknown Book"}
                                                        </td>

                                                        <td>
                                                            {issue.issueDate
                                                                ? new Date(
                                                                    issue.issueDate
                                                                ).toLocaleDateString()
                                                                : "-"}
                                                        </td>

                                                        <td>
                                                            {issue.dueDate
                                                                ? new Date(
                                                                    issue.dueDate
                                                                ).toLocaleDateString()
                                                                : "-"}
                                                        </td>

                                                        <td>

                                                            <span
                                                                className={
                                                                    issue.status === "Overdue"
                                                                        ? "overdue-badge"
                                                                        : "available-badge"
                                                                }
                                                            >
                                                                {issue.status}
                                                            </span>

                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            )}

                        </div>

                    </section>

                )}

                {/* RETURN BOOK */}

                {activePage === "Return Book" && (

                    <section className="books-page">

                        <div className="page-heading">

                            <div>

                                <h2>
                                    Return Book
                                </h2>

                                <p>
                                    Manage books returned by library members
                                </p>

                            </div>

                            <button
                                className="refresh-button"
                                onClick={() => {
                                    fetchBooks();
                                    fetchMembers();
                                    fetchIssues();
                                }}
                            >
                                ↻ Refresh
                            </button>

                        </div>

                        <div className="section-header recent-header">

                            <div>

                                <h2>
                                    Currently Issued Books
                                </h2>

                                <p>
                                    Select a book to process its return
                                </p>

                            </div>

                        </div>

                        <div className="books-table-container">

                            {issueLoading ? (

                                <div className="loading">
                                    Loading issued books...
                                </div>

                            ) : activeIssues.length === 0 ? (

                                <div className="no-books">

                                    <div>
                                        📥
                                    </div>

                                    <h3>
                                        No books to return
                                    </h3>

                                    <p>
                                        There are currently no issued books.
                                    </p>

                                </div>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>
                                            <th>#</th>
                                            <th>Member</th>
                                            <th>Membership ID</th>
                                            <th>Book</th>
                                            <th>Issue Date</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                            <th>Overdue Days</th>
                                            <th>Fine</th>
                                            <th>Action</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {activeIssues.map(
                                            (issue, index) => {

                                                const member =
                                                    issue.memberId;

                                                const book =
                                                    issue.bookId;

                                                return (

                                                    <tr
                                                        key={issue._id}
                                                    >

                                                        <td>
                                                            {index + 1}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {member?.name ||
                                                                    "Unknown Member"}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {member?.membershipId ||
                                                                "-"}
                                                        </td>

                                                        <td>
                                                            {book?.title ||
                                                                "Unknown Book"}
                                                        </td>

                                                        <td>
                                                            {issue.issueDate
                                                                ? new Date(
                                                                    issue.issueDate
                                                                ).toLocaleDateString()
                                                                : "-"}
                                                        </td>

                                                        <td>
                                                            {issue.dueDate
                                                                ? new Date(
                                                                    issue.dueDate
                                                                ).toLocaleDateString()
                                                                : "-"}
                                                        </td>

                                                        <td>

                                                            <span
                                                                className={
                                                                    issue.status === "Overdue"
                                                                        ? "overdue-badge"
                                                                        : "available-badge"
                                                                }
                                                            >
                                                                {issue.status}
                                                            </span>

                                                        </td>

                                                        <td>
                                                            {issue.overdueDays ||
                                                                0}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                ₹
                                                                {issue.fine ||
                                                                    0}
                                                            </strong>
                                                        </td>

                                                        <td>

                                                            <button
                                                                className="save-button"
                                                                onClick={() =>
                                                                    returnBook(
                                                                        issue._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    returningBook
                                                                }
                                                            >
                                                                {returningBook
                                                                    ? "Returning..."
                                                                    : "📥 Return Book"}
                                                            </button>

                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            )}

                        </div>

                    </section>

                )}

                {/* TRANSACTIONS */}

                {activePage === "Transactions" && (

                    <section className="books-page">

                        <div className="page-heading">

                            <div>

                                <h2>
                                    Transactions
                                </h2>

                                <p>
                                    Complete history of book issues and returns
                                </p>

                            </div>

                            <button
                                className="refresh-button"
                                onClick={fetchIssues}
                            >
                                ↻ Refresh
                            </button>

                        </div>

                        <div className="stats-grid">

                            <div className="stat-card">

                                <div className="stat-icon blue">
                                    📋
                                </div>

                                <div>

                                    <span>
                                        Total Transactions
                                    </span>

                                    <h2>
                                        {issues.length}
                                    </h2>

                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon green">
                                    📤
                                </div>

                                <div>

                                    <span>
                                        Active Issues
                                    </span>

                                    <h2>
                                        {
                                            issues.filter(
                                                (issue) =>
                                                    issue.status ===
                                                    "Issued"
                                            ).length
                                        }
                                    </h2>

                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon orange">
                                    ⚠️
                                </div>

                                <div>

                                    <span>
                                        Overdue
                                    </span>

                                    <h2>
                                        {
                                            issues.filter(
                                                (issue) =>
                                                    issue.status ===
                                                    "Overdue"
                                            ).length
                                        }
                                    </h2>

                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon purple">
                                    💰
                                </div>

                                <div>

                                    <span>
                                        Total Fine
                                    </span>

                                    <h2>
                                        ₹
                                        {
                                            issues.reduce(
                                                (total, issue) =>
                                                    total +
                                                    Number(
                                                        issue.fine || 0
                                                    ),
                                                0
                                            )
                                        }
                                    </h2>

                                </div>

                            </div>

                        </div>

                        <div className="section-header recent-header">

                            <div>

                                <h2>
                                    Transaction History
                                </h2>

                                <p>
                                    Issue, return, overdue and fine details
                                </p>

                            </div>

                        </div>

                        <div className="books-toolbar">

                            <input
                                type="text"
                                placeholder="🔍 Search member, membership ID or book..."
                                value={transactionSearch}
                                onChange={(e) =>
                                    setTransactionSearch(
                                        e.target.value
                                    )
                                }
                            />

                            <select
                                value={transactionStatusFilter}
                                onChange={(e) =>
                                    setTransactionStatusFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="All">
                                    All Status
                                </option>

                                <option value="Issued">
                                    Issued
                                </option>

                                <option value="Overdue">
                                    Overdue
                                </option>

                                <option value="Returned">
                                    Returned
                                </option>

                            </select>

                            <button
                                className="refresh-button"
                                onClick={fetchIssues}
                            >
                                ↻ Refresh
                            </button>

                        </div>

                        <div className="books-table-container">

                            {issueLoading ? (

                                <div className="loading">
                                    Loading transactions...
                                </div>

                            ) : filteredTransactions.length === 0 ? (

                                <div className="no-books">

                                    <div>
                                        📋
                                    </div>

                                    <h3>
                                        No transactions found
                                    </h3>

                                    <p>
                                        No transactions match your search
                                        or selected status.
                                    </p>

                                </div>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>
                                            <th>#</th>
                                            <th>Member</th>
                                            <th>Membership ID</th>
                                            <th>Book</th>
                                            <th>Issue Date</th>
                                            <th>Due Date</th>
                                            <th>Return Date</th>
                                            <th>Status</th>
                                            <th>Overdue Days</th>
                                            <th>Fine</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredTransactions.map(
                                            (issue, index) => {

                                                const member =
                                                    issue.memberId;

                                                const book =
                                                    issue.bookId;

                                                return (

                                                    <tr
                                                        key={issue._id}
                                                    >

                                                        <td>
                                                            {index + 1}
                                                        </td>

                                                        <td>

                                                            <strong>
                                                                {member?.name ||
                                                                    "Unknown Member"}
                                                            </strong>

                                                        </td>

                                                        <td>
                                                            {member?.membershipId ||
                                                                "-"}
                                                        </td>

                                                        <td>
                                                            {book?.title ||
                                                                "Unknown Book"}
                                                        </td>

                                                        <td>
                                                            {issue.issueDate
                                                                ? new Date(
                                                                    issue.issueDate
                                                                ).toLocaleDateString()
                                                                : "-"}
                                                        </td>

                                                        <td>
                                                            {issue.dueDate
                                                                ? new Date(
                                                                    issue.dueDate
                                                                ).toLocaleDateString()
                                                                : "-"}
                                                        </td>

                                                        <td>
                                                            {issue.returnDate
                                                                ? new Date(
                                                                    issue.returnDate
                                                                ).toLocaleDateString()
                                                                : "Not Returned"}
                                                        </td>

                                                        <td>

                                                            <span
                                                                className={
                                                                    issue.status ===
                                                                        "Returned"
                                                                        ? "category-badge"
                                                                        : issue.status ===
                                                                            "Overdue"
                                                                            ? "overdue-badge"
                                                                            : "available-badge"
                                                                }
                                                            >
                                                                {issue.status}
                                                            </span>

                                                        </td>

                                                        <td>
                                                            {issue.overdueDays ||
                                                                0}
                                                        </td>

                                                        <td>

                                                            <strong>
                                                                ₹
                                                                {issue.fine ||
                                                                    0}
                                                            </strong>

                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            )}

                        </div>

                    </section>

                )}

            </main>

        </div>
    );
}

export default App;
