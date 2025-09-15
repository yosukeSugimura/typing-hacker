import { locator } from 'codeceptjs';

const { I } = inject();

/**
 * Page Object for E-Typing website
 * Handles interactions with typing games and exercises
 */
export class TypingPage {
  // Locators
  public readonly businessVarietyLink = "//a[@title='タイピングバラエティ ビジネス ビジネス格言']";
  public readonly typingFrame = '#typing_content';
  public readonly startButton = '#start_btn';
  public readonly appContainer = "//*[@id='app']";
  public readonly sentenceText = '//*[@id="sentenceText"]/div/span[2]';
  public readonly scoreDisplay = '.score';
  public readonly timeDisplay = '.time';
  public readonly resultContainer = '.result';

  // URLs
  public readonly urls = {
    businessVariety: '/roma/variety/business.asp',
    home: '/',
    practice: '/roma/check/',
  };

  /**
   * Navigate to business variety typing page
   */
  async goToBusinessVariety(): Promise<void> {
    I.amOnPage(this.urls.businessVariety);
    await I.waitForElement(this.businessVarietyLink, 10);
  }

  /**
   * Click on business variety link
   */
  async clickBusinessVariety(): Promise<void> {
    I.click(this.businessVarietyLink);
    await I.waitForElement(this.typingFrame, 10);
  }

  /**
   * Start typing game within iframe
   */
  async startTypingGame(): Promise<void> {
    await within({ frame: this.typingFrame }, async () => {
      await I.waitForElement(this.startButton, 10);
      I.click(this.startButton);
      I.wait(2);
      I.pressKey('Space');
      I.wait(3.25);
      I.click(this.appContainer);
    });
  }

  /**
   * Get current sentence text to type
   */
  async getCurrentSentence(): Promise<string> {
    let sentence = '';
    await within({ frame: this.typingFrame }, async () => {
      const textArray = await I.grabTextFromAll(this.sentenceText);
      sentence = textArray[0] || '';
    });
    return sentence;
  }

  /**
   * Type a single character
   */
  async typeCharacter(char: string): Promise<void> {
    await within({ frame: this.typingFrame }, async () => {
      I.pressKey(char.toLowerCase());
    });
  }

  /**
   * Type entire sentence with configurable speed and typo rate
   */
  async typeSentence(
    sentence: string,
    options: {
      typingSpeed?: number;
      typoRate?: number;
      charDelay?: number;
    } = {}
  ): Promise<void> {
    const {
      typingSpeed = parseInt(process.env.TYPING_SPEED || '50'),
      typoRate = parseFloat(process.env.TYPO_PROBABILITY || '0.01'),
      charDelay = 0.01,
    } = options;

    const chars = sentence.split('');

    await within({ frame: this.typingFrame }, async () => {
      for (const char of chars) {
        // Simulate occasional typos
        if (Math.random() < typoRate) {
          // Type wrong character first
          const wrongChar = this.getRandomChar();
          I.pressKey(wrongChar);
          await I.wait(0.1);
          // Correct it with backspace and right character
          I.pressKey('Backspace');
          await I.wait(0.05);
        }

        I.pressKey(char.toLowerCase());

        // Variable typing speed simulation
        const delay = charDelay + Math.random() * 0.02;
        await I.wait(delay);
      }
    });
  }

  /**
   * Complete a full typing session
   */
  async completeTypingSession(rounds: number = 30): Promise<void> {
    for (let round = 0; round < rounds; round++) {
      console.log(`Round ${round + 1}/${rounds}`);

      try {
        const sentence = await this.getCurrentSentence();

        if (sentence) {
          await this.typeSentence(sentence);
        }

        // Wait between sentences
        await I.wait(0.8);
      } catch (error) {
        console.warn(`Error in round ${round + 1}:`, error);
        // Continue with next round
        await I.wait(1);
      }
    }
  }

  /**
   * Wait for typing game to be ready
   */
  async waitForGameReady(): Promise<void> {
    await within({ frame: this.typingFrame }, async () => {
      await I.waitForElement(this.sentenceText, 15);
    });
  }

  /**
   * Check if game is finished
   */
  async isGameFinished(): Promise<boolean> {
    let finished = false;
    try {
      await within({ frame: this.typingFrame }, async () => {
        await I.waitForElement(this.resultContainer, 2);
        finished = true;
      });
    } catch (error) {
      finished = false;
    }
    return finished;
  }

  /**
   * Get final score and statistics
   */
  async getFinalResults(): Promise<{ score?: string; time?: string }> {
    let results = {};

    try {
      await within({ frame: this.typingFrame }, async () => {
        await I.waitForElement(this.resultContainer, 5);

        try {
          const score = await I.grabTextFrom(this.scoreDisplay);
          results = { ...results, score };
        } catch (e) {
          console.warn('Could not grab score');
        }

        try {
          const time = await I.grabTextFrom(this.timeDisplay);
          results = { ...results, time };
        } catch (e) {
          console.warn('Could not grab time');
        }
      });
    } catch (error) {
      console.warn('Could not get final results:', error);
    }

    return results;
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string): Promise<void> {
    I.saveScreenshot(`typing_${name}_${Date.now()}.png`);
  }

  /**
   * Get random character for typo simulation
   */
  private getRandomChar(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return chars[Math.floor(Math.random() * chars.length)];
  }

  /**
   * Handle frame switching helper
   */
  async withinTypingFrame<T>(fn: () => Promise<T>): Promise<T> {
    return await within({ frame: this.typingFrame }, fn);
  }
}

// Export singleton instance
export default new TypingPage();
