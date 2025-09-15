/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file');
type TypingPage = typeof import('./pages/TypingPage');
type TypingHelper = typeof import('./helpers/TypingHelper');

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    current: any;
    TypingPage: TypingPage;
    TypingHelper: TypingHelper;
  }
  interface Methods extends Playwright, REST {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
