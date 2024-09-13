import {getNovelId} from "../src/utils.js";

describe("getNovelId", function() {
    it("ok", function() {
        expect(getNovelId("foo").length).toBe(32);
        expect(getNovelId("呆书").length).toBe(32);
    });
});
