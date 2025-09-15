// CodeceptJSとNode.js環境用のグローバル型定義

declare global {
  // CodeceptJSテスト関数
  const Feature: (title: string) => void;
  const Scenario: (title: string, fn: (args: { I: CodeceptJS.I }) => Promise<void>) => void;
  const Before: (fn: (args: { I: CodeceptJS.I }) => Promise<void>) => void;
  const After: (fn: (args: { I: CodeceptJS.I }) => Promise<void>) => void;
  const BeforeSuite: (fn: (args: { I: CodeceptJS.I }) => Promise<void>) => void;
  const AfterSuite: (fn: (args: { I: CodeceptJS.I }) => Promise<void>) => void;

  // CodeceptJSヘルパー関数
  const within: (
    locator: CodeceptJS.LocatorOrString | { frame: string },
    fn: () => Promise<void>
  ) => Promise<void>;
  const actor: (fn: any) => any;
  const inject: () => any;

  // Node.jsプロセス環境
  namespace NodeJS {
    interface ProcessEnv {
      // 基本設定
      BASE_URL?: string;
      API_ENDPOINT?: string;

      // ブラウザ設定
      HEADLESS?: string;
      DEBUG?: string;

      // タイピング自動化設定
      TYPING_SPEED?: string;
      TYPO_PROBABILITY?: string;
      TYPING_ROUNDS?: string;
      AUTO_RETRY?: string;
      MAX_RETRIES?: string;

      // テスト設定
      TAKE_SCREENSHOTS?: string;
      RECORD_VIDEO?: string;
      KEEP_VIDEOS_ON_PASS?: string;
      WAIT_TIMEOUT?: string;
      ACTION_TIMEOUT?: string;
      PARALLEL_TESTS?: string;

      // 標準Node.js環境変数
      NODE_ENV?: string;
      PORT?: string;
      [key: string]: string | undefined;
    }
  }
}

// CodeceptJS Iオブジェクト拡張
declare namespace CodeceptJS {
  interface I {
    // steps_file.tsからのカスタムステップ
    randomTypo(element: string, prob?: number): Promise<void>;
    humanType(
      text: string,
      options?: {
        wpm?: number;
        typoRate?: number;
        variability?: boolean;
      }
    ): Promise<void>;
    waitForElementWithRetry(
      locator: string,
      maxRetries?: number,
      timeout?: number
    ): Promise<boolean>;
    startTypingSession(): void;
    endTypingSession(): void;
    takeTimestampedScreenshot(name: string): Promise<void>;
    logWithEmoji(level: 'info' | 'warn' | 'error' | 'success', message: string): void;
    generateRealisticTypo(char: string): string;
  }

  interface SupportObject {
    I: CodeceptJS.I;
    current: any;
  }
}

export {};
