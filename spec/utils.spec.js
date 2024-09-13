import {getNovelId, pick} from "../src/utils.js";

describe("getNovelId", function() {
    it("ok", function() {
        expect(getNovelId("foo").length).toBe(32);
        expect(getNovelId("呆书").length).toBe(32);
    });
});

describe("pick", function() {
    it("ok", function() {
        expect(pick([1,2,3], 1).length).toBe(1);
        expect(pick([1,2,3], 2).length).toBe(2);
        expect(pick([1,2,3], 3).length).toBe(3);
    })
})
