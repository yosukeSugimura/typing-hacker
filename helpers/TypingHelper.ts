const Helper = require('codeceptjs').Helper;

/**
 * タイピング自動化用カスタムヘルパー
 * 高度なタイピングユーティリティと統計追跡を提供
 */
class TypingHelper extends Helper {
  private stats = {
    totalCharacters: 0,
    totalTypos: 0,
    startTime: 0,
    sessions: 0,
  };

  /**
   * タイポシミュレーション付きの拡張タイピング
   */
  async smartType(
    element: string,
    options: {
      speed?: number;
      typoRate?: number;
      humanize?: boolean;
    } = {}
  ): Promise<void> {
    const {
      speed = parseInt(process.env.TYPING_SPEED || '50'),
      typoRate = parseFloat(process.env.TYPO_PROBABILITY || '0.01'),
      humanize = true,
    } = options;

    const helper = this.helpers && this.helpers['Playwright'];

    if (typeof element === 'string') {
      const chars = element.split('');

      for (const char of chars) {
        // タイポをシミュレート
        if (Math.random() < typoRate) {
          await this.introduceTypo(char, helper);
          this.stats.totalTypos++;
        }

        await helper.pressKey(char.toLowerCase());
        this.stats.totalCharacters++;

        // 人間のような可変タイピング速度
        if (humanize) {
          const delay = this.calculateHumanDelay(speed, char);
          await helper.wait(delay);
        }
      }
    }
  }

  /**
   * リアルなタイポを導入
   */
  private async introduceTypo(intendedChar: string, helper: any): Promise<void> {
    // QWERTYキーボードの隣接キーを取得
    const adjacentKeys = this.getAdjacentKeys(intendedChar);
    const typoChar =
      adjacentKeys[Math.floor(Math.random() * adjacentKeys.length)] || this.getRandomChar();

    // 間違い文字をタイピング
    await helper.pressKey(typoChar);
    await helper.wait(0.1 + Math.random() * 0.2); // ミスに「気づく」ための一時停止

    // ミスを修正
    await helper.pressKey('Backspace');
    await helper.wait(0.05 + Math.random() * 0.1);
  }

  /**
   * 人間のようなタイピング遅延を計算
   */
  private calculateHumanDelay(wpm: number, char: string): number {
    // WPMからの基本遅延（単語当たり平均5文字と仮定）
    const baseDelay = (60 / (wpm * 5)) * 1000;

    // 異なる文字タイプに対する変動を追加
    let multiplier = 1;

    if (/[A-Z]/.test(char)) {
      multiplier = 1.2; // 大文字はより遅く
    } else if (/[0-9]/.test(char)) {
      multiplier = 1.1; // 数字はより遅く
    } else if (/[.,!?;:]/.test(char)) {
      multiplier = 1.3; // 句読点はより遅く
    } else if (char === ' ') {
      multiplier = 0.8; // スペースはより速く
    }

    // ランダム変動を追加（±20%）
    const variation = 0.8 + Math.random() * 0.4;

    return (baseDelay * multiplier * variation) / 1000; // 秒に変換
  }

  /**
   * QWERTYキーボードの隣接キーを取得
   */
  private getAdjacentKeys(key: string): string[] {
    const keyMap: Record<string, string[]> = {
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
    };

    return keyMap[key.toLowerCase()] || [];
  }

  /**
   * フォールバックタイポ用のランダム文字を取得
   */
  private getRandomChar(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return chars[Math.floor(Math.random() * chars.length)];
  }

  /**
   * セッション統計追跡を開始
   */
  startSession(): void {
    this.stats.startTime = Date.now();
    this.stats.sessions++;
    console.log(`🚀 タイピングセッション #${this.stats.sessions} を開始`);
  }

  /**
   * セッションを終了して統計を表示
   */
  endSession(): void {
    const duration = (Date.now() - this.stats.startTime) / 1000;
    const wpm = Math.round(this.stats.totalCharacters / 5 / (duration / 60));
    const accuracy = Math.round(
      ((this.stats.totalCharacters - this.stats.totalTypos) / this.stats.totalCharacters) * 100
    );

    console.log('📊 セッション統計:');
    console.log(`   ⏱️  時間: ${duration.toFixed(1)}秒`);
    console.log(`   ⚡ 文字数: ${this.stats.totalCharacters}`);
    console.log(`   ❌ タイポ: ${this.stats.totalTypos}`);
    console.log(`   🎯 正確率: ${accuracy}%`);
    console.log(`   📈 WPM: ${wpm}`);

    // 次のセッションのために統計をリセット
    this.resetStats();
  }

  /**
   * 統計をリセット
   */
  private resetStats(): void {
    this.stats = {
      totalCharacters: 0,
      totalTypos: 0,
      startTime: 0,
      sessions: this.stats.sessions, // セッション数を維持
    };
  }

  /**
   * 現在の統計を取得
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * ランダム変動付きで待機
   */
  async humanWait(baseSeconds: number, variation: number = 0.2): Promise<void> {
    const helper = this.helpers && this.helpers['Playwright'];
    const actualWait = baseSeconds * (1 - variation + Math.random() * variation * 2);
    await helper.wait(actualWait);
  }

  /**
   * キーボード配列を考慮した拡張ランダムタイポ
   */
  async randomTypo(intendedChar: string, probability: number = 0.05): Promise<void> {
    const helper = this.helpers && this.helpers['Playwright'];

    if (Math.random() < probability) {
      const adjacentKeys = this.getAdjacentKeys(intendedChar);
      let typoChar = intendedChar;

      // 隣接キーを取得し、ランダムにフォールバック
      if (adjacentKeys.length > 0) {
        typoChar = adjacentKeys[Math.floor(Math.random() * adjacentKeys.length)];
      } else {
        typoChar = this.getRandomChar();
      }

      // 意図した文字と異なる場合のみタイポを作成
      if (typoChar !== intendedChar.toLowerCase()) {
        await helper.pressKey(typoChar);
        await this.humanWait(0.1, 0.5);
        await helper.pressKey('Backspace');
        await this.humanWait(0.05, 0.3);
        this.stats.totalTypos++;
      }
    }
  }

  /**
   * リトライ付きで要素の存在をチェック
   */
  async waitForElementWithRetry(
    locator: string,
    maxRetries: number = 3,
    timeout: number = 5
  ): Promise<boolean> {
    const helper = this.helpers && this.helpers['Playwright'];

    for (let i = 0; i < maxRetries; i++) {
      try {
        await helper.waitForElement(locator, timeout);
        return true;
      } catch (error) {
        console.log(`要素の試行 ${i + 1}/${maxRetries} が失敗: ${locator}`);
        if (i === maxRetries - 1) {
          console.warn(`${maxRetries}回の試行後も要素が見つかりません: ${locator}`);
          return false;
        }
        await this.humanWait(1);
      }
    }
    return false;
  }
}

export = TypingHelper;
