const mongoose = require("mongoose");
require("dotenv").config();

jest.mock("../middleware/auth"); // Mockear el middleware de autenticación

describe("Un Test básico", () => {
  beforeAll(async () => {
    // Conectar a la base de datos antes de ejecutar los tests
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    // Cerrar la conexión a MongoDB después de ejecutar los tests
    await mongoose.connection.close();
  });

  test("Jest is working", () => {
    expect(1 + 1).toBe(2);
  });

  test("MongoDB connection is successful", () => {
    const connectionState = mongoose.connection.readyState;
    // 1 = connected, 0 = disconnected, 2 = connecting, 3 = disconnecting
    expect(connectionState).toBe(1);
  });

  test("Can perform basic MongoDB operations", async () => {
    // Create a temporary collection for testing
    const TestModel = mongoose.model(
      "Test",
      new mongoose.Schema({ name: String }),
      "test_collection"
    );

    try {
      // Try to insert a document
      const testDoc = await TestModel.create({ name: "test" });
      expect(testDoc.name).toBe("test");

      // Clean up - delete the test document
      await TestModel.deleteOne({ _id: testDoc._id });
    } catch (error) {
      throw new Error(`MongoDB operation failed: ${error.message}`);
    }
  });
});
