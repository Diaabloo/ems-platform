// Exemple de tests unitaires pour des fonctions utilitaires

/**
 * Exemple de fonction utilitaire à tester
 * Dans votre projet, remplacez par vos vraies fonctions
 */
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};

describe("Math Utils", () => {
  describe("add", () => {
    it("should add two positive numbers", () => {
      expect(add(2, 3)).toBe(5);
    });

    it("should add positive and negative numbers", () => {
      expect(add(5, -3)).toBe(2);
    });

    it("should handle zero", () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });
  });

  describe("subtract", () => {
    it("should subtract two numbers", () => {
      expect(subtract(10, 3)).toBe(7);
    });

    it("should handle negative results", () => {
      expect(subtract(3, 10)).toBe(-7);
    });
  });

  describe("multiply", () => {
    it("should multiply two numbers", () => {
      expect(multiply(4, 5)).toBe(20);
    });

    it("should handle multiplication by zero", () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it("should handle negative numbers", () => {
      expect(multiply(-3, 4)).toBe(-12);
    });
  });

  describe("divide", () => {
    it("should divide two numbers", () => {
      expect(divide(10, 2)).toBe(5);
    });

    it("should throw error on division by zero", () => {
      expect(() => divide(10, 0)).toThrow("Division by zero");
    });

    it("should handle decimal results", () => {
      expect(divide(5, 2)).toBeCloseTo(2.5);
    });
  });
});
