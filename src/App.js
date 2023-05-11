import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const api = "https://library-api-zc2z.onrender.com";

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${api}/api/books`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const searchBooks = async () => {
    try {
      const response = await axios.get(
        `${api}/api/books/search?query=${searchQuery}`
      );
      setBooks(response.data);
    } catch (error) {
      console.error("Error searching books:", error);
      setBooks([]); // Clear books array on error
    }
  };

  const fetchBooksByPage = async (page) => {
    try {
      const response = await axios.get(`${api}/api/books/page/${page}`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books by page:", error);
    }
  };

  const fetchSortedBooks = async () => {
    try {
      const response = await axios.get(`${api}/api/books?sortBy=${sortBy}`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching sorted books:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    searchBooks();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchBooksByPage(page);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <div className="container">
      <h1>Book App</h1>

      {/* Search Form */}
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>

      {/* Book List */}
      {books.length === 0 ? (
        <p className="no-results">No results found.</p>
      ) : (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book._id} className="book-item">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <span>{currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>
          Next Page
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort By:</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="">None</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
        <button onClick={fetchSortedBooks}>Sort</button>
      </div>
    </div>
  );
};

export default App;
