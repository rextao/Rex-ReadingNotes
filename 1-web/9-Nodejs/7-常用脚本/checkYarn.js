// 为保证依赖安装与线上一致（线上pipeline使用yarn安装）
// swiftengineering部署机器上，会使用execa执行sh脚本，导致process.env.npm_execpath不包含yarn
if (process.env.name !== 'swiftengineering' && !/yarn\.js$/.test(process.env.npm_execpath || '')) {
    console.warn(
        '\u001b[33m请使用yarn安装依赖.\u001b[39m\n',
    );
    process.exit(1);
}
