# Artist Personality Test

艺术家人格测试网站，基于 React + TypeScript + Vite。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址，通常是 `http://localhost:3000`。

## 生成静态文件

```bash
npm run build
```

生成结果在 `dist/` 目录，可以部署到 GitHub Pages、Netlify、Vercel 或任何静态网站托管服务。

## GitHub Pages 部署

这个项目已经配置了相对路径：

- `vite.config.mjs` 里设置了 `base: './'`
- 图片路径使用 `./images/...`

所以部署到 `https://用户名.github.io/仓库名/` 这种 GitHub Pages 子路径时，图片也能正常显示。

推荐步骤：

1. 新建 GitHub 仓库，把本文件夹内容推上去。
2. 进入仓库的 `Settings > Pages`。
3. 在 `Build and deployment` 中选择 `GitHub Actions`。
4. 推送后等待 Actions 自动构建并发布。
