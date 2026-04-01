const request = require("supertest");

process.env.JWT_SECRET = "test-jwt-secret-for-testing";
process.env.NODE_ENV = "test";

const app = require("../app");
const {
  createTestUser,
  generateTestToken,
  createTestNote,
} = require("./helpers");

require("./setup");

let user;
let token;

beforeEach(async () => {
  user = await createTestUser();
  token = generateTestToken(user._id);
});

describe("GET /api/notes", () => {
  it("should return empty array when no notes exist", async () => {
    const res = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.notes).toHaveLength(0);
    expect(res.body.count).toBe(0);
  });

  it("should return user notes sorted by pin then date", async () => {
    await createTestNote(user._id, { title: "Note 1" });
    await createTestNote(user._id, { title: "Note 2", isPinned: true });

    const res = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.notes).toHaveLength(2);
    expect(res.body.notes[0].title).toBe("Note 2");
    expect(res.body.notes[0].isPinned).toBe(true);
  });

  it("should not return other users notes", async () => {
    const otherUser = await createTestUser({ email: "other@example.com" });
    await createTestNote(otherUser._id, { title: "Other User Note" });
    await createTestNote(user._id, { title: "My Note" });

    const res = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.notes).toHaveLength(1);
    expect(res.body.notes[0].title).toBe("My Note");
  });

  it("should return 401 without token", async () => {
    const res = await request(app).get("/api/notes");

    expect(res.status).toBe(401);
  });
});

describe("POST /api/notes", () => {
  it("should create a new note", async () => {
    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "New Note", content: "<p>Hello</p>", color: "blue" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.note.title).toBe("New Note");
    expect(res.body.note.color).toBe("blue");
    expect(res.body.note.userId).toBe(user._id.toString());
  });

  it("should use default color when not specified", async () => {
    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Default Color Note" });

    expect(res.status).toBe(201);
    expect(res.body.note.color).toBe("yellow");
  });

  it("should return 400 if title is missing", async () => {
    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "No title" });

    expect(res.status).toBe(400);
  });

  it("should return 400 for invalid color", async () => {
    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test", color: "rainbow" });

    expect(res.status).toBe(400);
  });
});

describe("PUT /api/notes/:id", () => {
  it("should update an existing note", async () => {
    const note = await createTestNote(user._id);

    const res = await request(app)
      .put(`/api/notes/${note._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title", color: "green" });

    expect(res.status).toBe(200);
    expect(res.body.note.title).toBe("Updated Title");
    expect(res.body.note.color).toBe("green");
  });

  it("should return 403 when updating other users note", async () => {
    const otherUser = await createTestUser({ email: "other@example.com" });
    const otherNote = await createTestNote(otherUser._id);

    const res = await request(app)
      .put(`/api/notes/${otherNote._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Hacked" });

    expect(res.status).toBe(403);
  });

  it("should return 400 for invalid ObjectId", async () => {
    const res = await request(app)
      .put("/api/notes/invalid-id")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test" });

    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/notes/:id/pin", () => {
  it("should toggle pin status", async () => {
    const note = await createTestNote(user._id, { isPinned: false });

    const res = await request(app)
      .patch(`/api/notes/${note._id}/pin`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.note.isPinned).toBe(true);

    const res2 = await request(app)
      .patch(`/api/notes/${note._id}/pin`)
      .set("Authorization", `Bearer ${token}`);

    expect(res2.body.note.isPinned).toBe(false);
  });
});

describe("DELETE /api/notes/:id", () => {
  it("should delete a note", async () => {
    const note = await createTestNote(user._id);

    const res = await request(app)
      .delete(`/api/notes/${note._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Note deleted");

    const checkRes = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(checkRes.body.notes).toHaveLength(0);
  });

  it("should return 404 for non-existent note", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app)
      .delete(`/api/notes/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should return 403 when deleting other users note", async () => {
    const otherUser = await createTestUser({ email: "other@example.com" });
    const otherNote = await createTestNote(otherUser._id);

    const res = await request(app)
      .delete(`/api/notes/${otherNote._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});
