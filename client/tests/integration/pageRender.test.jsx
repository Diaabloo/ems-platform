/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * Composant page exemple pour tester le rendu d'une page complète
 */
const DashboardPage = () => (
  <div>
    <header>
      <h1>Dashboard</h1>
      <nav>
        <a href="/employees">Employees</a>
        <a href="/departments">Departments</a>
      </nav>
    </header>
    <main>
      <section>
        <h2>Overview</h2>
        <p>Total Employees: 48</p>
      </section>
    </main>
    <footer>
      <p>Employee Management System © 2025</p>
    </footer>
  </div>
);

describe("Dashboard Page Integration", () => {
  it("should render page header with title", () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole("heading", { name: /Dashboard/i }),
    ).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole("link", { name: /Employees/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Departments/i }),
    ).toBeInTheDocument();
  });

  it("should render main content section", () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole("heading", { name: /Overview/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Total Employees: 48/i)).toBeInTheDocument();
  });

  it("should render footer with copyright", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Employee Management System/i)).toBeInTheDocument();
  });

  it("should have complete page structure", () => {
    const { container } = render(<DashboardPage />);
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("main")).toBeInTheDocument();
    expect(container.querySelector("footer")).toBeInTheDocument();
  });
});
