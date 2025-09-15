// 拡張されたタイピング機能を持つステップファイル

export = function () {
  return actor({
    /**
     * リアルなキーボードミスを含む拡張ランダムタイポ
     * @param element - タイポを起こす可能性のある文字
     * @param prob - タイポを起こす確率 (デフォルト: 0.05)
     */
    async randomTypo(element: string, prob: number = 0.05): Promise<void> {
      const helper = this.helpers?.['TypingHelper'];

      if (helper && typeof helper.randomTypo === 'function') {
        await helper.randomTypo(element, prob);
      } else {
        // フォールバック実装
        const shouldMakeTypo = Math.random() < prob;

        if (shouldMakeTypo) {
          // キーボード配列に基づくリアルなタイポを生成
          const typoChar = this.generateRealisticTypo(element);
          this.pressKey(typoChar);
          await this.wait(0.1 + Math.random() * 0.2); // 「気づく」ための一時停止
          this.pressKey('Backspace');
          await this.wait(0.05 + Math.random() * 0.1); // 短い修正一時停止
        }
      }
    },

    /**
     * 人間のような速度と時々のミスでタイピング
     * @param text - タイピングするテキスト
     * @param options - タイピングオプション
     */
    async humanType(
      text: string,
      options: {
        wpm?: number;
        typoRate?: number;
        variability?: boolean;
      } = {}
    ): Promise<void> {
      const {
        wpm = parseInt(process.env.TYPING_SPEED || '50'),
        typoRate = parseFloat(process.env.TYPO_PROBABILITY || '0.01'),
        variability = true,
      } = options;

      const helper = this.helpers?.['TypingHelper'];

      if (helper && typeof helper.smartType === 'function') {
        await helper.smartType(text, { speed: wpm, typoRate, humanize: variability });
      } else {
        // フォールバック: 遅延を伴う一文字ずつのタイピング
        const chars = text.split('');
        const baseDelay = ((60 / (wpm * 5)) * 1000) / 1000; // 秒に変換

        for (const char of chars) {
          await this.randomTypo(char, typoRate);
          this.pressKey(char.toLowerCase());

          if (variability) {
            const delay = baseDelay * (0.8 + Math.random() * 0.4); // ±20%の変動
            await this.wait(delay);
          }
        }
      }
    },

    /**
     * リトライロジック付きで要素を待機
     * @param locator - 要素ロケーター
     * @param maxRetries - 最大リトライ回数
     * @param timeout - 試行毎のタイムアウト
     */
    async waitForElementWithRetry(
      locator: string,
      maxRetries: number = 3,
      timeout: number = 5
    ): Promise<boolean> {
      const helper = this.helpers?.['TypingHelper'];

      if (helper && typeof helper.waitForElementWithRetry === 'function') {
        return await helper.waitForElementWithRetry(locator, maxRetries, timeout);
      } else {
        // フォールバック実装
        for (let i = 0; i < maxRetries; i++) {
          try {
            await this.waitForElement(locator, timeout);
            return true;
          } catch (error) {
            if (i === maxRetries - 1) {
              console.warn(`${maxRetries}回の試行後も要素が見つかりません: ${locator}`);
              return false;
            }
            await this.wait(1);
          }
        }
        return false;
      }
    },

    /**
     * 統計付きでタイピングセッションを開始
     */
    startTypingSession(): void {
      const helper = this.helpers?.['TypingHelper'];
      if (helper && typeof helper.startSession === 'function') {
        helper.startSession();
      } else {
        console.log('🚀 タイピングセッションを開始...');
      }
    },

    /**
     * タイピングセッションを終了して結果を表示
     */
    endTypingSession(): void {
      const helper = this.helpers?.['TypingHelper'];
      if (helper && typeof helper.endSession === 'function') {
        helper.endSession();
      } else {
        console.log('✅ タイピングセッションが完了しました！');
      }
    },

    /**
     * タイムスタンプ付きでスクリーンショットを撮影
     * @param name - スクリーンショット名
     */
    async takeTimestampedScreenshot(name: string): Promise<void> {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      this.saveScreenshot(`${name}_${timestamp}.png`);
    },

    /**
     * 絵文字とフォーマット付きでログ出力
     * @param level - ログレベル
     * @param message - ログに出力するメッセージ
     */
    logWithEmoji(level: 'info' | 'warn' | 'error' | 'success', message: string): void {
      const emojis = {
        info: '💡',
        warn: '⚠️',
        error: '❌',
        success: '✅',
      };

      console.log(`${emojis[level]} ${message}`);
    },

    /**
     * QWERTYキーボード配列に基づいてリアルなタイポを生成
     * @param char - 意図した文字
     */
    generateRealisticTypo(char: string): string {
      const keyboardMap: Record<string, string[]> = {
        a: ['q', 'w', 's', 'z'],
        s: ['a', 'w', 'e', 'd', 'z', 'x'],
        d: ['s', 'e', 'r', 'f', 'x', 'c'],
        f: ['d', 'r', 't', 'g', 'c', 'v'],
        g: ['f', 't', 'y', 'h', 'v', 'b'],
        h: ['g', 'y', 'u', 'j', 'b', 'n'],
        j: ['h', 'u', 'i', 'k', 'n', 'm'],
        k: ['j', 'i', 'o', 'l', 'm'],
        l: ['k', 'o', 'p'],
        q: ['w', 'a'],
        w: ['q', 'e', 'a', 's'],
        e: ['w', 'r', 's', 'd'],
        r: ['e', 't', 'd', 'f'],
        t: ['r', 'y', 'f', 'g'],
        y: ['t', 'u', 'g', 'h'],
        u: ['y', 'i', 'h', 'j'],
        i: ['u', 'o', 'j', 'k'],
        o: ['i', 'p', 'k', 'l'],
        p: ['o', 'l'],
        z: ['a', 's', 'x'],
        x: ['z', 's', 'd', 'c'],
        c: ['x', 'd', 'f', 'v'],
        v: ['c', 'f', 'g', 'b'],
        b: ['v', 'g', 'h', 'n'],
        n: ['b', 'h', 'j', 'm'],
        m: ['n', 'j', 'k'],
        ' ': ['b', 'v', 'c', 'x', 'z'], // スペースバーの一般的なミス
      };

      const lowerChar = char.toLowerCase();
      const adjacentKeys = keyboardMap[lowerChar];

      if (adjacentKeys && adjacentKeys.length > 0) {
        return adjacentKeys[Math.floor(Math.random() * adjacentKeys.length)];
      }

      // 完全にランダムな文字へのフォールバック
      const randomChars = 'abcdefghijklmnopqrstuvwxyz';
      return randomChars[Math.floor(Math.random() * randomChars.length)];
    },
  });
};
