import fs from "fs";
import path from "path";
import ejs from "ejs";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import { transformFromAst } from "babel-core";

function createAsset(filePath) {
  // 1.获取文件内容
  const source = fs.readFileSync(filePath, {
    encoding: "utf-8",
  });

  // 2.获取依赖关系
  const ast = parser.parse(source, {
    sourceType: "module",
  });

  const deps = [];
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    },
  });

  const { code } = transformFromAst(ast, null, {
    presets: ["env"],
  });

  return {
    filePath,
    code,
    deps,
  };
}

// 构建图结构
function createGraph() {
  const mainAsset = createAsset("./example/main.js");

  const queue = [mainAsset];

  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve("./example", relativePath));
      queue.push(child);
    });
  }

  return queue;
}

function build(graph) {
  const template = fs.readFileSync("./bundle.ejs", {
    encoding: "utf-8",
  });

  const code = ejs.render(template);

  fs.writeFileSync("./dist/bundle.js", code);
  console.log(code);
}

const graph = createGraph();
build(graph);
