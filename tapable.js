import { SyncHook, AsyncParallelHook } from "./node_modules/tapable/lib/index.js";


class List {
  getRoutes() {
    return "World";
  }
}

class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook([
        "source",
        "target",
        "routesList",
      ]),
    };
  }

  setSpeed(newSpeed) {
      // following call returns undefined even when you returned value
      // 触发事件
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise(source, target) {
    const routesList = new List();
    return this.hooks.calculateRoutes
      .promise(source, target, routesList)
      .then((res) => {
        // res is undefined for AsyncParallelHook
        return routesList.getRoutes();
      });
  }

  useNavigationSystemAsync(source, target, callback) {
    const routesList = new List();
    this.hooks.calculateRoutes.callAsync(source, target, routesList, (err) => {
      if (err) return callback(err);
      callback(null, routesList.getRoutes());
    });
  }
}

// 注册
const car = new Car();
car.hooks.accelerate.tap("LoggerPlugin", (newSpeed) => {
  console.log(`Accelerating to ${newSpeed}`);
});

car.hooks.calculateRoutes.tapPromise("LoggerPluginPromise", (source,target) => {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      console.log("——————————tapPromise",source,target)
      resolve()
    })
  })
});

// 触发
car.setSpeed(10)
car.useNavigationSystemPromise(["1","2","3"],1)