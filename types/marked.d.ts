export module 'marked' {
  import {Token, Tokens} from 'marked';
  namespace Tokens {
    interface Paragraph {
      tokens: Token[];
    }
  }
}
