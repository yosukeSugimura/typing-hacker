/**
 * ビジネスタイピングテスト
 * e-typing.ne.jp ビジネスバラエティセクション用の自動タイピングテスト
 *
 * 機能:
 * - リアルなエラーを含む人間のようなタイピング
 * - 設定可能な速度とエラー率
 * - セッション統計とレポート
 * - エラーハンドリングとリトライロジック
 * - 失敗時のスクリーンショット
 */

Feature('ビジネスタイピング自動化');

Before(async ({ I }) => {
  I.logWithEmoji('info', 'Starting new typing test session');
  I.startTypingSession();
});

After(async ({ I }) => {
  I.endTypingSession();
  I.logWithEmoji('success', 'Typing test session completed');
});

/**
 * デフォルト設定での基本ビジネスタイピングテスト
 */
Scenario('デフォルト設定でビジネスタイピングエクササイズを完了する', async ({ I }) => {
  const rounds = parseInt(process.env.TYPING_ROUNDS || '30');

  I.logWithEmoji('info', `Starting business typing test for ${rounds} rounds`);

  try {
    // Navigate to business variety page
    I.amOnPage('/roma/variety/business.asp');
    I.logWithEmoji('success', 'Successfully navigated to business variety page');

    // Click on business variety link
    I.click("//a[@title='タイピングバラエティ ビジネス ビジネス格言']");
    I.wait(3);

    // Start the typing game within iframe
    await within({ frame: '#typing_content' }, async () => {
      I.click('#start_btn');
      I.wait(2);
      I.pressKey('Space');
      I.wait(3.25);
      I.click("//*[@id='app']");

      // Complete typing rounds
      for (let index = 0; index < rounds; index++) {
        I.logWithEmoji('info', `Round ${index + 1}/${rounds}`);

        try {
          const textArray = await I.grabTextFromAll('//*[@id="sentenceText"]/div/span[2]');
          const sentence = textArray[0];

          if (sentence) {
            // Use enhanced typing function
            await I.humanType(sentence, {
              wpm: parseInt(process.env.TYPING_SPEED || '50'),
              typoRate: parseFloat(process.env.TYPO_PROBABILITY || '0.01'),
              variability: true,
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          I.logWithEmoji('warn', `Error in round ${index + 1}: ${errorMessage}`);
        }

        I.wait(0.8);
      }
    });

    I.logWithEmoji('success', `Completed ${rounds} rounds of typing`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    I.logWithEmoji('error', `Test failed: ${errorMessage}`);
    await I.takeTimestampedScreenshot('business_typing_error');
    throw error;
  }
});

/**
 * 最小エラーでの高速タイピングテスト
 */
Scenario('高速タイピングテスト (80+ WPM)', async ({ I }) => {
  const rounds = parseInt(process.env.TYPING_ROUNDS || '20');

  I.logWithEmoji('info', 'Starting high-speed typing test (80+ WPM)');

  try {
    I.amOnPage('/roma/variety/business.asp');
    I.click("//a[@title='タイピングバラエティ ビジネス ビジネス格言']");
    I.wait(3);

    await within({ frame: '#typing_content' }, async () => {
      I.click('#start_btn');
      I.wait(2);
      I.pressKey('Space');
      I.wait(3.25);
      I.click("//*[@id='app']");

      // High-speed typing with low error rate
      for (let round = 0; round < rounds; round++) {
        I.logWithEmoji('info', `High-speed round ${round + 1}/${rounds}`);

        try {
          const textArray = await I.grabTextFromAll('//*[@id="sentenceText"]/div/span[2]');
          const sentence = textArray[0];

          if (sentence) {
            await I.humanType(sentence, {
              wpm: 80, // 80 WPM
              typoRate: 0.005, // Very low error rate
              variability: true,
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          I.logWithEmoji('warn', `Error in high-speed round ${round + 1}: ${errorMessage}`);
        }

        I.wait(0.5); // Shorter wait between sentences
      }
    });

    I.logWithEmoji('success', 'High-speed typing test completed');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    I.logWithEmoji('error', `High-speed test failed: ${errorMessage}`);
    await I.takeTimestampedScreenshot('high_speed_typing_error');
    throw error;
  }
});

/**
 * エラー復旧とリトライテスト
 */
Scenario('エラー復旧とリトライ機構をテストする', async ({ I }) => {
  I.logWithEmoji('info', 'Testing error recovery mechanisms');

  try {
    // Test with retry logic
    const pageLoaded = await I.waitForElementWithRetry(
      "//a[@title='タイピングバラエティ ビジネス ビジネス格言']",
      3, // 3 retries
      5 // 5 second timeout per attempt
    );

    if (!pageLoaded) {
      I.logWithEmoji('warn', 'Page failed to load after retries, taking screenshot');
      await I.takeTimestampedScreenshot('page_load_failure');
      throw new Error('Failed to load page after multiple retries');
    }

    I.amOnPage('/roma/variety/business.asp');
    I.click("//a[@title='タイピングバラエティ ビジネス ビジネス格言']");

    // Test frame switching and game start with retry
    let gameStarted = false;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        I.logWithEmoji('info', `Game start attempt ${attempt}/${maxRetries}`);

        await within({ frame: '#typing_content' }, async () => {
          I.click('#start_btn');
          I.wait(2);
          I.pressKey('Space');
          I.wait(3.25);
          I.click("//*[@id='app']");
        });

        gameStarted = true;
        break;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        I.logWithEmoji('warn', `Game start attempt ${attempt} failed: ${errorMessage}`);
        if (attempt === maxRetries) {
          throw error;
        }
        I.wait(2); // Wait before retry
      }
    }

    if (gameStarted) {
      // Perform a few rounds to test the typing functionality
      await within({ frame: '#typing_content' }, async () => {
        for (let round = 0; round < 5; round++) {
          try {
            const textArray = await I.grabTextFromAll('//*[@id="sentenceText"]/div/span[2]');
            const sentence = textArray[0];

            if (sentence) {
              await I.humanType(sentence);
            }

            I.wait(0.8);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            I.logWithEmoji('warn', `Error in recovery test round ${round + 1}: ${errorMessage}`);
          }
        }
      });

      I.logWithEmoji('success', 'Error recovery test completed successfully');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    I.logWithEmoji('error', `Error recovery test failed: ${errorMessage}`);
    await I.takeTimestampedScreenshot('error_recovery_failure');
    throw error;
  }
});
