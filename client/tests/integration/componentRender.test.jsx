/**
 * @jest-environment jsdom
 */
"use client";

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * Composants exemple pour les tests d'intégration
 * À remplacer par vos vrais composants
 */
const UserForm = ({ onSubmit }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      onSubmit({ name, email });
      setSubmitted(true);
      setName("");
      setEmail("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        data-testid="name-input"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        data-testid="email-input"
      />
      <button type="submit">Submit</button>
      {submitted && <p>Form submitted successfully!</p>}
    </form>
  );
};

const UserList = ({ users }) => {
  return (
    <ul>
      {users.length === 0 ? (
        <li>No users found</li>
      ) : (
        users.map((user, index) => (
          <li key={index}>
            {user.name} - {user.email}
          </li>
        ))
      )}
    </ul>
  );
};

const UserApp = () => {
  const [users, setUsers] = React.useState([]);

  const handleAddUser = (user) => {
    setUsers([...users, user]);
  };

  return (
    <div>
      <h1>User Management</h1>
      <UserForm onSubmit={handleAddUser} />
      <h2>Users</h2>
      <UserList users={users} />
    </div>
  );
};

describe("Integration: User Management App", () => {
  it("should render the complete app", () => {
    render(<UserApp />);
    expect(screen.getByText(/User Management/i)).toBeInTheDocument();
  });

  it("should display empty state initially", () => {
    render(<UserApp />);
    expect(screen.getByText(/No users found/i)).toBeInTheDocument();
  });

  it("should add user when form is submitted", async () => {
    render(<UserApp />);

    const nameInput = screen.getByTestId("name-input");
    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/John Doe - john@example\.com/i),
      ).toBeInTheDocument();
    });
  });

  it("should display success message after form submission", async () => {
    render(<UserApp />);

    const nameInput = screen.getByTestId("name-input");
    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: "Jane Smith" } });
    fireEvent.change(emailInput, { target: { value: "jane@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Form submitted successfully!/i),
      ).toBeInTheDocument();
    });
  });

  it("should add multiple users", async () => {
    render(<UserApp />);

    const addUser = (name, email) => {
      const nameInput = screen.getByTestId("name-input");
      const emailInput = screen.getByTestId("email-input");
      const submitButton = screen.getByRole("button", { name: /submit/i });

      fireEvent.change(nameInput, { target: { value: name } });
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.click(submitButton);
    };

    addUser("User One", "user1@example.com");
    addUser("User Two", "user2@example.com");

    await waitFor(() => {
      expect(
        screen.getByText(/User One - user1@example\.com/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/User Two - user2@example\.com/i),
      ).toBeInTheDocument();
    });
  });

  it("should clear form inputs after submission", async () => {
    render(<UserApp />);

    const nameInput = screen.getByTestId("name-input");
    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
    });
  });
});
