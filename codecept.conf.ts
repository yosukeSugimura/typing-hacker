import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
require('dotenv').config();

// HEADLESS=true環境変数で実行時にヘッドレスモードを有効化
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// 全ての共通プラグインを有効化 https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './tests/**/*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: process.env.BASE_URL || 'https://www.e-typing.ne.jp',
      show: !process.env.HEADLESS,
      windowSize: '1200x900',
      waitForTimeout: 15000,
      waitForAction: 1000,
      // デバッグ用の動画録画を有効化
      video: true,
      keepVideoForPassedTests: false,
      // 必要時にデバッグ用にブラウザを開いたままにする
      keepBrowserState: process.env.DEBUG === 'true',
      // デバッグ用のトレースを有効化
      trace: process.env.DEBUG === 'true',
    },
    REST: {
      endpoint: process.env.API_ENDPOINT || '',
    },
  },
  include: {
    I: './steps_file.ts',
    // Page Objects
    TypingPage: './pages/TypingPage.ts',
    // ヘルパー
    TypingHelper: './helpers/TypingHelper.ts',
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true,
    },
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy',
      outputDir: './reports/allure-results',
    },
    stepByStepReport: {
      enabled: true,
      deleteSuccessful: false,
      animateSlides: true,
      ignoreSteps: ['scroll*', 'moveCursor*', 'see*'],
    },
    retryFailedStep: {
      enabled: true,
      retries: 2,
    },
    pauseOnFail: {
      enabled: process.env.DEBUG === 'true',
    },
  },
  bootstrap: null,
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          verbose: false,
          steps: true,
        },
      },
    },
  },
  name: 'typing-hacker',
  // グローバルタイムアウト設定
  timeout: 10000,
  // 不安定なテスト用のリトライ設定
  retry: 2,
  // 複数ブラウザサポート
  multiple: {
    parallel: {
      // 2プロセスで実行
      chunks: 2,
      browsers: ['chromium'],
    },
    smoke: {
      // スモークテストを実行
      browsers: ['chromium', 'firefox', 'webkit'],
    },
  },
};
