/**
 * @jest-environment jsdom
 */
"use client"

import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { jest } from "@jest/globals" // Import jest to fix the undeclared variable error

/**
 * Composant exemple pour les tests
 * À remplacer par vos vrais composants
 */
const Counter = ({ initialValue = 0 }) => {
  const [count, setCount] = React.useState(initialValue)

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}

const Button = ({ onClick, children, disabled = false }) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
)

describe("Counter Component", () => {
  it("should render with initial value 0", () => {
    render(<Counter />)
    expect(screen.getByText(/Counter: 0/i)).toBeInTheDocument()
  })

  it("should render with custom initial value", () => {
    render(<Counter initialValue={5} />)
    expect(screen.getByText(/Counter: 5/i)).toBeInTheDocument()
  })

  it("should increment counter when Increment button is clicked", () => {
    render(<Counter initialValue={0} />)
    const incrementButton = screen.getByRole("button", { name: /increment/i })

    fireEvent.click(incrementButton)
    expect(screen.getByText(/Counter: 1/i)).toBeInTheDocument()

    fireEvent.click(incrementButton)
    expect(screen.getByText(/Counter: 2/i)).toBeInTheDocument()
  })

  it("should decrement counter when Decrement button is clicked", () => {
    render(<Counter initialValue={5} />)
    const decrementButton = screen.getByRole("button", { name: /decrement/i })

    fireEvent.click(decrementButton)
    expect(screen.getByText(/Counter: 4/i)).toBeInTheDocument()
  })

  it("should reset counter when Reset button is clicked", () => {
    render(<Counter initialValue={10} />)
    const resetButton = screen.getByRole("button", { name: /reset/i })

    fireEvent.click(resetButton)
    expect(screen.getByText(/Counter: 0/i)).toBeInTheDocument()
  })

  it("should have all buttons rendered", () => {
    render(<Counter />)
    expect(screen.getByRole("button", { name: /increment/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /decrement/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument()
  })
})

describe("Button Component", () => {
  it("should render button with children text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /Click me/i })).toBeInTheDocument()
  })

  it("should call onClick handler when clicked", () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole("button", { name: /Click me/i })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled={true}>Click me</Button>)
    expect(screen.getByRole("button", { name: /Click me/i })).toBeDisabled()
  })

  it("should not call onClick when disabled", () => {
    const handleClick = jest.fn()
    render(
      <Button onClick={handleClick} disabled={true}>
        Click me
      </Button>,
    )

    const button = screen.getByRole("button", { name: /Click me/i })
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })
})
