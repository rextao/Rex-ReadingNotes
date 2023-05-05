> 汇总：https://github.com/dexteryy/spellbook-of-modern-webdev#--spellbook-of-modern-web-dev





BFF Pattern

1. Backend for Frontend
2. 应用场景
   - 微前端或需要消费多个外部api或其他服务
3. 主要解决
   - 前端请求多个微服务，需要按前端展示加工数据，浪费前端资源的问题
4. 中间层（BFF）
   - 调用相关的微服务API并获取所需的数据
   - 按前端展示需要调整数据
   - 发送调整好的数据到前端



迈入现代 Web 开发



基于 Webpack 包装的工程化建设

1. 对webpack进行包装，但业务项目还需要配置一些webpack，抽象程度很有限，配置 API 的设计也五花八门
2. 编译工具的演进，vite\snowpack等的出现，webpack可能会被取代
3. dev与build等命令，只停留在比较低的水平，还缺少很多，如测试、发布、部署等等环节

