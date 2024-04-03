export class ChangeOutputPath {
    apply(hooks) {
        hooks.emitFile.tap("changeOutputPath", (context) => {
            // 修改输出路径
            console.log("change")
            context.ChangeOutputPath("./dist/newBundle.js")
        });
    }
}
