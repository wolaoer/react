# README

## 项目名称: stu-shop-manager

stu-shop-manager 是一个基于 React 和 Ant Design 的信息管理系统。它包括用户管理、角色管理、菜单管理等功能。

## 项目目录结构

```
stu-shop-manager
├── src
│   ├── pages
│   │   ├── admin
│   │   │   ├── dashboard
│   │   │   ├── menu
│   │   │   ├── role
│   │   │   └── user
│   │   ├── Login.js
│   │   ├── LoginForm.js
│   │   └── RegisterForm.js
│   ├── routes
│   │   └── index.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 使用的插件

- `React`: 用于构建用户界面的 JavaScript 库。
- `Ant Design`: 一个服务于企业级产品的设计体系。
- `axios`: 用于浏览器和 node.js 的基于 Promise 的 HTTP 客户端。
- `CryptoJS`: 用于 JavaScript 的加密标准库。

## 组件使用说明

- `LoginForm.js`: 登录表单组件，包含邮箱和密码输入框，以及登录按钮。
- `RegisterForm.js`: 注册表单组件，包含邮箱和密码输入框，以及注册按钮。
- `admin/menu`: 菜单管理组件，包含菜单的添加、编辑、删除等功能。
- `admin/role`: 角色管理组件，包含角色的添加、编辑、删除等功能。
- `admin/user`: 用户管理组件，包含用户的添加、编辑、删除等功能。

## 项目运行启动方式

1. 克隆项目到本地

```bash
git clone https://github.com/wolaoer/react.git
```

2. 进入项目目录

```bash
cd stu-shop-manager
```

3. 安装依赖

```bash
npm install
```

4. 启动项目

```bash
npm start
```

在浏览器中访问 `http://localhost:3000` 来查看项目。

登录test@qq.com进行权限的控制 （不用输入密码，已经自动生成）
给其他用户分配角色后  退出 登录指定角色后 只拥有对应权限
