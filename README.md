# Hunao 實驗看板

團隊實驗追蹤系統，用於管理 2 週週期的市場驗證實驗。

## 功能

- 四欄位看板：待辦 → 進行中 → 審核中 → 完成
- 實驗卡片：名稱、描述、負責人、日期、收入訊號
- 即時狀態更新
- SQLite 本地資料庫

## 技術棧

- Next.js 16 + TypeScript
- Tailwind CSS
- better-sqlite3
- Standalone 部署

## 開發

```bash
npm install
npm run dev
```

開啟 http://localhost:3000

## 資料庫

資料庫檔案位於 `data/kanban.db`，已加入 `.gitignore` 不會提交。

## API

- `GET /api/experiments` - 取得所有實驗
- `POST /api/experiments` - 建立新實驗
- `PUT /api/experiments/:id` - 更新實驗
- `DELETE /api/experiments/:id` - 刪除實驗
