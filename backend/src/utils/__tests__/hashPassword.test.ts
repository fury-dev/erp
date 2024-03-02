import { describe, it, expect } from "@jest/globals";
import { checkIfHasMatches, encryptPassword } from "../hashPassword";
describe("hashPassword", () => {
  it("hash Password and match hash", async () => {
    const test = "test";
    const hashed = await encryptPassword(test);

    expect(test).not.toEqual(hashed);
    const matchPassword = await checkIfHasMatches(hashed, test);
    expect(matchPassword).toBeTruthy();
  });
});
