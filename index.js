import fs from "fs";
import path from "path";
import ejs from "ejs";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import { transformFromAst } from "babel-core";
import { jsonLoader } from "./jsonLoader.js";

let id = 0;

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [jsonLoader],
      },
    ],
  },
};

function createAsset(filePath) {
  // 1.获取文件内容
  let source = fs.readFileSync(filePath, {
    encoding: "utf-8",
  });

  // initLoader,使用loader进行处理
  const loader = webpackConfig.module.rules;
  // loader上下文对象
  const loaderContext = {
    addDeps(dep) {
      console.log("addDeps", dep);
    },
  };

  loader.forEach(({ test, use }) => {
    if (test.test(filePath)) {
      // 从后到前顺序执行
      if (Array.isArray(use)) {
        use.forEach((fn) => {
          source = fn.call(loaderContext, source);
        });
      }
    }
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
    mapping: {},
    id: id++,
  };
}

// 构建图结构
function createGraph() {
  const mainAsset = createAsset("./example/main.js");

  const queue = [mainAsset];

  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve("./example", relativePath));
      asset.mapping[relativePath] = child.id;
      queue.push(child);
    });
  }

  return queue;
}

function build(graph) {
  const template = fs.readFileSync("./bundle.ejs", {
    encoding: "utf-8",
  });

  const data = graph.map((asset) => {
    const { id, code, mapping } = asset;
    return {
      id,
      code,
      mapping,
    };
  });

  const code = ejs.render(template, { data });

  fs.writeFileSync("./dist/bundle.js", code);
}

const graph = createGraph();
build(graph);
