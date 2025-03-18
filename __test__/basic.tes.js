describe("Un Test básico", () => {
  beforeAll(() => {
    console.log("Before all tests");
  });

  test("Jest is working", () => {
    expect(1 + 1).toBe(2);
  });
});
