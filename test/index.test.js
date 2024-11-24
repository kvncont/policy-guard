import fs from "fs";
import nock from "nock";
import assert from "node:assert";
import { afterEach, beforeEach, describe, test } from "node:test";
import path from "path";
import { Probot, ProbotOctokit } from "probot";
import { fileURLToPath } from "url";
import myProbotApp from "../index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const privateKey = fs.readFileSync(
  path.join(__dirname, "fixtures/mock-cert.pem"),
  "utf-8",
);

const repositoryCreatedPayload = JSON.parse(
  fs.readFileSync(path.join(__dirname, "fixtures/repository.created.json"), "utf-8"),
);

describe("My Probot app", () => {
  let probot;

  beforeEach(() => {
    nock.disableNetConnect();
    probot = new Probot({
      appId: 123,
      privateKey,
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    });
    probot.load(myProbotApp);
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  test("creates a CODEOWNERS file when a repository is created", async () => {
    const mock = nock("https://api.github.com")
      .post("/app/installations/2/access_tokens")
      .reply(200, {
        token: "test",
        permissions: {
          contents: "write",
        },
      })
      .get("/repos/Kokodoki/dev/contents/.github/CODEOWNERS")
      .reply(404)
      .put("/repos/Kokodoki/dev/contents/.github/CODEOWNERS", (body) => {
        assert.deepEqual(body, {
          message: "chore: add CODEOWNERS file",
          content: Buffer.from("* @kvncont\n/.github/ @kokodoki/devops\n").toString("base64"),
        });
        return true;
      })
      .reply(201, {});

    await probot.receive({ name: "repository", payload: repositoryCreatedPayload });

    // Verifica que no haya solicitudes pendientes
    if (mock.pendingMocks().length > 0) {
      console.error("Pending mocks: ", mock.pendingMocks());
    }
    assert.deepStrictEqual(mock.pendingMocks(), []);
  });
});