const {
    HookMap,
    SyncHook
} = require('./lib/index');

const keyedHook = new HookMap(key => new SyncHook(["arg"]))
keyedHook.for("some-key").tap("MyPlugin", (arg) => {
    console.log('123')
});
keyedHook.for("some-key").tap("MyPlugin", (arg) => {
    console.log('456')
});

const hook = keyedHook.get("some-key");
if(hook !== undefined) {
    hook.callAsync("arg", err => {
        console.log('error')
    });
}