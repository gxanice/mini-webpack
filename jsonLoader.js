export function jsonLoader(source) {
  console.log("jsonLoader");
  this.addDeps("jsonLoader");

  return `export default ${JSON.stringify(source)}`;
}
