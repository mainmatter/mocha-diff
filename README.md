# mocha-diff

This lib is an extraction of [Mocha's diff implementation](https://mochajs.org/#-diff)

Why did I want to extract Mocha's implementation? Because of this line: 

> Mocha’s own diff output does not conform to any known standards, and is designed to be human-readable.

## Installation

```
npm install mocha-diff
```

## Usage

```js
import { generateDiff } from 'mocha-diff';

console.log(generateDiff(actual, expected));
```

## Example output

```
      + expected - actual

       function aVeryNiceTestFunction() {
      -  console.log('I really should impolement something here');
      -  console.log('I really should impolement something here');
      -  console.log('I really should impolement something here');
      -  console.log('I really should impolement something here');
      -  console.log('I really should impolement something here');
      +  console.log('I really should implement something here');
      +  console.log('I really should implement something here');
       }
       
       function badlyIndented() {
         let items = [
           'one',
      -      'two',
      +    'two',
           'three',
      -  'four',
      -    'five'
      +    'four',
      +    'five',
         ];
       }
      -
      -function possiblyMissing() {
      -  console.log('a very important function');
      -}
```

The implementation also supports colours if your terminal supports colours: 

<img width="466" alt="Screenshot 2023-03-19 at 10 44 35" src="https://user-images.githubusercontent.com/594890/226170317-098c9707-04d5-43a3-8d2e-bf66a797ac24.png">
