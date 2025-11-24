# WASM 演示

一个非常简单的 WASM 演示，包括以下几个示例

- 斐波那契数列
- 埃拉托斯特尼筛法
- 曼德勃罗集
- 快速傅里叶变换

## 编译

请使用如下命令将 Rust 代码编译为 WASM

```sh
cargo install wasm-pack # 如果未安装 wasm-pack
wasm-pack build --target web
```

## 运行

在根目录运行如下命令启动本地 HTTP 服务器，然后访问对应的端口

```sh
python -m http.server # 默认端口为 8000
# 或者
npx http-server # 默认端口为 8080
```
