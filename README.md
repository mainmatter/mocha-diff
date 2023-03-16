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