# 🚀 タイピングハッカー v2.0

<div align="center">

**e-typing.ne.jp 専用のインテリジェント自動タイピングツール**

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)](https://www.typescriptlang.org/)
[![CodeceptJS](https://img.shields.io/badge/CodeceptJS-3.5-orange.svg)](https://codecept.io/)
[![Playwright](https://img.shields.io/badge/Playwright-1.35-purple.svg)](https://playwright.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

_人間のようなタイピングとリアルなタイポシミュレーションによる自動テスト_

</div>

---

## ✨ 機能

### 🎯 **スマートタイピング**

- **人間らしいタイピングパターン** - リアルな速度変動
- **インテリジェントなタイポシミュレーション** - QWERTYキーボード配列に基づく
- **設定可能なタイピング速度** - 30〜100+ WPM
- **実際のユーザーを模倣したエラー修正動作**

### 📊 **パフォーマンス分析**

- **リアルタイム統計** - WPM、正確性、セッション時間の追跡
- **詳細レポート** - Allure統合による
- **パフォーマンスベンチマーク** - 異なる速度での比較
- **セッション比較** と進捗追跡

### 🛠️ **開発体験**

- **モダンTypeScript** - 完全な型安全性
- **Page Object Model** - 保守しやすいコード
- **包括的エラーハンドリング** - リトライ機能付き
- **デバッグモード** - 詳細ログとスクリーンショット

### 🚀 **高度な自動化**

- **複数ブラウザサポート** - Chrome、Firefox、Safari
- **並列テスト実行** - より高速な結果
- **ヘッドレスモード** - CI/CD統合対応
- **動画録画** とスクリーンショット機能

---

## 🚀 クイックスタート

### 前提条件

- **Node.js** 16以上 と **npm** 8以上
- **Git** - バージョン管理のため

### 1. クローンとセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/yosukeSugimura/typing-hacker.git
cd typing-hacker

# ワンコマンドセットアップ（依存関係とブラウザをインストール）
npm run setup
```

### 2. 設定（オプション）

```bash
# 環境設定をコピーしてカスタマイズ
cp .env.example .env
# .envファイルを好みの設定に編集
```

### 3. 最初のテストを実行

```bash
# ブラウザ表示でタイピング自動化を開始
npm start

# またはヘッドレスモードで実行
npm run test:headless

# 詳細ログ付きデバッグモード
npm run dev
```

---

## 📚 使い方ガイド

### 基本コマンド

```bash
# 🎮 テストコマンド
npm start                 # デフォルトタイピングテストを実行
npm run test             # 上記と同じ
npm run test:headless    # ブラウザウィンドウなしで実行
npm run test:debug       # 詳細出力付きデバッグモード
npm run test:parallel    # テストを並列実行
npm run test:retry       # 失敗テストを自動リトライ

# 🛠️ 開発コマンド
npm run dev              # 開発モード（デバッグ + 監視）
npm run build            # 型チェックとビルド
npm run validate         # 全品質チェックを実行

# 📊 レポートコマンド
npm run report           # インタラクティブAllureレポートを開く
npm run report:generate  # 静的HTMLレポートを生成

# 🧹 メンテナンスコマンド
npm run clean            # 出力とレポートをクリーン
npm run clean:install    # クリーンインストール
```

### 環境設定

`.env`ファイルで動作をカスタマイズできます：

```bash
# タイピング動作
TYPING_SPEED=50          # 毎分ワード数 (30-100+)
TYPO_PROBABILITY=0.01    # エラー率 (0.0-0.1)
TYPING_ROUNDS=30         # タイピングする文章数

# ブラウザ設定
HEADLESS=false           # ブラウザウィンドウの表示/非表示
DEBUG=false              # 詳細ログを有効化
RECORD_VIDEO=false       # テスト動画を録画

# テスト設定
WAIT_TIMEOUT=15000       # 要素待機タイムアウト (ミリ秒)
PARALLEL_TESTS=2         # 並列プロセス数
```

---

## 🏗️ プロジェクト構造

```
typing-hacker/
├── 📁 tests/              # テストシナリオ
│   └── business_typing_test.ts
├── 📁 pages/              # Page Object Models
│   └── TypingPage.ts
├── 📁 helpers/            # カスタムヘルパー
│   └── TypingHelper.ts
├── 📁 config/             # 設定ファイル
├── 📁 output/             # テスト出力（スクリーンショット、動画）
├── 📁 reports/            # テストレポート（Allure）
├── 📄 codecept.conf.ts    # メイン設定
├── 📄 steps_file.ts       # カスタムステップ定義
├── 📄 .env                # 環境変数
└── 📄 package.json        # 依存関係とスクリプト
```

---

## 🧪 テストシナリオ

### 利用可能なテスト

1. **🎯 基本ビジネスタイピング** - 標準的な自動化テスト
2. **⚡ 高速テスト** - 80+ WPM パフォーマンステスト
3. **👤 人間シミュレーション** - エラーを含むリアルなタイピング
4. **🔄 エラー復旧** - リトライ機構のテスト
5. **📊 パフォーマンスベンチマーク** - 異なるWPMレートでの速度比較

### 特定のテストを実行

```bash
# 特定のテストファイルを実行
npx codeceptjs run tests/business_typing_test.ts

# 特定のシナリオを実行
npx codeceptjs run --grep "高速タイピング"

# カスタム設定で実行
npx codeceptjs run --override '{"helpers": {"Playwright": {"show": true}}}'
```

---

## 🎨 カスタマイズ

### 新しいテストの作成

```bash
# 新しいテストファイルを生成
npm run generate:test

# 新しいページオブジェクトを生成
npm run generate:page

# 新しいヘルパーを生成
npm run generate:helper
```

### カスタムタイピングパターン

```typescript
// テストファイル内で
await I.humanType('Hello World', {
  wpm: 60, // 毎分60ワード
  typoRate: 0.02, // 2%のエラー率
  variability: true, // 人間らしい速度変動
});
```

### Page Objectの使用

```typescript
// TypingPageオブジェクトを使用
const { TypingPage } = inject();

// ナビゲーションとゲーム開始
await TypingPage.goToBusinessVariety();
await TypingPage.startTypingGame();

// カスタム設定でタイピング
await TypingPage.typeSentence('Hello World', {
  typingSpeed: 50,
  typoRate: 0.01,
});
```

---

## 🔧 高度な設定

### ブラウザ設定

```typescript
// codecept.conf.ts
helpers: {
  Playwright: {
    browser: 'chromium', // または 'firefox', 'webkit'
    windowSize: '1200x900',
    video: true,
    trace: true
  }
}
```

### 並列実行

```bash
# テストを並列実行
npm run test:parallel

# カスタム並列設定
npx codeceptjs run-multiple parallel --override '{"multiple": {"parallel": {"chunks": 4}}}'
```

### CI/CD統合

```yaml
# GitHub Actionsの例
- name: タイピングテストを実行
  run: |
    npm ci
    npm run setup
    HEADLESS=true npm run test:headless
```

---

## 📊 レポートと分析

### Allureレポート

```bash
# インタラクティブレポートを生成して表示
npm run report

# 静的HTMLレポートを生成
npm run report:generate
```

### コンソール統計

各テストセッションでリアルタイム統計を提供：

- ⏱️ セッション時間
- ⚡ タイピングした文字数
- ❌ タイポ数
- 🎯 正確率（パーセント）
- 📈 実効WPM

---

## 🐛 トラブルシューティング

### よくある問題

**テストが開始できない場合:**

```bash
# ブラウザを再インストール
npx playwright install

# 設定をチェック
npm run validate
```

**要素が見つからないエラー:**

```bash
# デバッグモードを有効化
DEBUG=true npm run test:debug

# スクリーンショットを撮影
npm run test -- --verbose
```

**パフォーマンスの問題:**

```bash
# ヘッドレスモードで実行
HEADLESS=true npm test

# 並列プロセスを減らす
PARALLEL_TESTS=1 npm test
```

### デバッグモード

```bash
# スクリーンショットと動画付きのフルデバッグモード
DEBUG=true RECORD_VIDEO=true npm run test:debug
```

---

## 🤝 貢献

1. リポジトリを **フォーク** する
2. 機能ブランチを **作成** する (`git checkout -b feature/amazing-feature`)
3. 変更を **コミット** する (`git commit -m 'Add amazing feature'`)
4. ブランチに **プッシュ** する (`git push origin feature/amazing-feature`)
5. **Pull Request** を開く

### 開発環境のセットアップ

```bash
# 依存関係をインストール
npm install

# プリコミットフックをインストール
npx husky install

# 品質チェックを実行
npm run validate
```

---

## 📄 ライセンス

このプロジェクトは **MITライセンス** の下でライセンスされています - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

---

## 🙏 謝辞

- **[CodeceptJS](https://codecept.io/)** - 素晴らしいテストフレームワーク
- **[Playwright](https://playwright.dev/)** - 信頼性の高いブラウザ自動化
- **[e-typing.ne.jp](https://www.e-typing.ne.jp/)** - タイピング練習サイト

---

<div align="center">

**[yosukeSugimura](https://github.com/yosukeSugimura) が❤️で作成**

_ハッピータイピング！ 🎯_

</div>
