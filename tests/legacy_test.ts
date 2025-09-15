Feature('レガシーテスト');

Scenario('基本的なタイピングテスト', async ({ I }) => {
  I.amOnPage('https://www.e-typing.ne.jp/roma/variety/business.asp');
  I.click("//a[@title='タイピングバラエティ ビジネス ビジネス格言']");
  I.wait(3);
  within({ frame: '#typing_content' }, async () => {
    I.click('#start_btn');
    I.wait(2);
    I.pressKey('Space');
    I.wait(3.25);
    I.click("//*[@id='app']");
    for (let index = 0; index < 30; index++) {
      const test = await I.grabTextFromAll('//*[@id="sentenceText"]/div/span[2]');
      const split = test[0].split('');
      split.forEach(element => {
        //I.randomTypo(element, 0.01)
        I.pressKey(element.toLowerCase());
        //I.wait(0.01)
      });
      //I.wait(1.06)
      I.wait(0.8);
    }
  });
});
