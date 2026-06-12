<div align="center">

# IBAS Barcode

**条码模块**

IBAS 系统的条码模块，基于 ZXing 库提供条形码与二维码的生成、解析功能，为业务对象提供条码标识能力。

Barcode module for the IBAS system — barcode and QR code generation/parsing powered by ZXing, providing barcode identification for business objects.

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-1.8+-orange.svg)](https://www.oracle.com/java/)
[![Maven](https://img.shields.io/badge/Maven-3.x-red.svg)](https://maven.apache.org/)
[![Version](https://img.shields.io/badge/version-0.2.0-green.svg)](pom.xml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-贡献--contributing)

</div>

---

## 📖 目录 | Table of Contents

- [✨ 特性 | Features](#-特性--features)
- [📦 模块结构 | Modules](#-模块结构--modules)
- [🚀 快速开始 | Quick Start](#-快速开始--quick-start)
- [📚 相关项目 | Related Projects](#-相关项目--related-projects)
- [🤝 贡献 | Contributing](#-贡献--contributing)
- [📄 许可证 | License](#-许可证--license)

---

## ✨ 特性 | Features

- **📊 条码生成** — 基于 ZXing 库生成多种格式的条形码与二维码
- **🔍 条码解析** — 解析条码图片获取编码内容
- **🔗 框架集成** — 与 IBAS 业务对象系统集成，为单据和物料提供条码标识
- **REST 服务** — 通过 Jersey 端点暴露条码生成与解析 API

---

## 📦 模块结构 | Modules

| 模块 | 类型 | 说明 |
|------|------|------|
| `ibas.barcode` | JAR | **核心模块** — ZXing 条码工具、数据转换、仓储层 |
| `ibas.barcode.service` | WAR | **REST 服务** — Jersey 端点（DataService、FileService） |

---

## 🚀 快速开始 | Quick Start

### 环境要求 | Prerequisites

- **JDK** 1.8+
- **Maven** 3.x
- [ibas-framework](https://github.com/color-coding/ibas-framework)（BOBAS 框架）

### 构建 | Build

```bash
# 克隆仓库
git clone https://github.com/color-coding/ibas.barcode.git
cd ibas.barcode

# 编译全部模块
./compile_packages.sh            # Linux / macOS
compile_packages.bat             # Windows

# 编译单个模块
mvn clean package install -Dmaven.test.skip=true -f ibas.barcode/pom.xml

# 运行测试
mvn test -f ibas.barcode/pom.xml

# 部署
./deploy_packages.sh
```

### Maven 依赖

```xml
<dependency>
    <groupId>org.colorcoding.apps</groupId>
    <artifactId>ibas.barcode</artifactId>
    <version>0.2.0</version>
</dependency>
```

---

## 📚 相关项目 | Related Projects

| 项目 | 说明 |
|------|------|
| [ibas-framework](https://github.com/color-coding/ibas-framework) | BOBAS 业务对象框架 |
| [ibas.materials](https://github.com/color-coding/ibas.materials) | 物料与库存模块 |

---

## 🤝 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 发起 Pull Request

---

## 📄 许可证 | License

本项目基于 [Apache License 2.0](LICENSE) 开源。
---

## 🙏 鸣谢 | Thanks

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/cyitianyou">昌昌</a><br>
      <sub>cyitianyou</sub>
    </td>
  </tr>
</table>

<div align="center">

**[Color-Coding Studio](http://colorcoding.org/)** · 咔啦工作室

</div>
