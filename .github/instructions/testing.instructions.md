---
description: "Use these guidelines when generating or updating tests."
applyTo: "**/*.{spec,test}.{ts,tsx}"
---

# Testing Guidelines

## Test conventions

- Write clear, focused tests that verify one behavior at a time
- Use descriptive test names that explain what is being tested and the expected outcome
- Follow Arrange-Act-Assert (AAA) pattern: set up test data, execute the code under test, verify results
- Keep tests independent - each test should run in isolation without depending on other tests
- Start with the simplest test case, then add edge cases and error conditions
- Tests should fail for the right reason - verify they catch the bugs they're meant to catch
- Mock external dependencies to keep tests fast and reliable
- Name test files with `.spec.ts`
- Name test functions with `when <condition>, expect <outcome>` format for clarity and consistency

## AAA Pattern

Every test body must be structured as **Arrange → Act → Assert** with a blank line between each section:

```typescript
it("when a valid coupon is applied, expect the discounted price to be returned", () => {
  // Arrange
  const course = createCourse({ price: 100 });
  const coupon = createCoupon({ discount: 20 });

  // Act
  const result = applyDiscount(course, coupon);

  // Assert
  expect(result.price).toBe(80);
});
```

- Never merge sections — keep Arrange, Act, and Assert visually separate
- The Assert section must contain at least one `expect()` call
- Avoid multiple Act steps in one test; split into separate tests

## When...Expect Naming Convention

Use `when <condition>, expect <outcome>` in test descriptions:

```typescript
describe("EnrollmentService", () => {
  describe("enroll", () => {
    beforeEach(() => {
      // common setup for all enroll tests
      // mock dependencies, reset test data, etc.
    });

    it(
      "when the user is already enrolled, expect an AlreadyEnrolledError to be thrown",
    );
    it(
      "when the course is at full capacity, expect a CourseFullError to be thrown",
    );
    it("when payment succeeds, expect the enrollment record to be persisted");
    it("when the course is free, expect enrollment to succeed without payment");
  });
});
```

- `describe` blocks use the **class or function name** being tested
- Nested `describe` blocks use the **method or behaviour** being tested
- `it` / `test` blocks follow the **when...expect** pattern — start with `when`

## Factory Functions

- Use factory functions with optional overrides instead of large fixture objects:

```typescript
function createCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: "course-1",
    title: "Default Course",
    price: 99,
    capacity: 30,
    ...overrides,
  };
}
```

## Mocking

- Mock all external dependencies in unit tests: databases, HTTP clients, email, payment services
- Use `jest.fn()` / `vi.fn()` for mocks; reset mocks in `beforeEach` with `jest.clearAllMocks()`
- Never make real network calls or hit a real database in unit tests
