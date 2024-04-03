import { bar } from "./bar.js";
import user from "./user.json";

export function foo() {
  bar();
  console.log("foo.js");
}
