import { generateDiff } from "../index.js";
import { expect } from 'chai';

describe('diff generation', function () {
  it("should generate unified diffs if 'inlineDiffs' is false", function () {
    var actual = 'a foo unified diff';
    var expected = 'a bar unified diff';

    var output = generateDiff(actual, expected);

    expect(
      output,
      'to be',
      '\n      + expected - actual\n\n      -a foo unified diff\n      +a bar unified diff\n      '
    );
  });

  it("should generate inline diffs if 'inlineDiffs' is true", function () {
    var actual = 'a foo inline diff';
    var expected = 'a bar inline diff';

    var output = generateDiff(actual, expected, {
      inlineDiffs: true,
    });

    expect(
      output,
      'to be',
      '      \n      actual expected\n      \n      a foobar inline diff\n      '
    );
  });

  it("should truncate overly long 'actual' ", function () {
    var actual = '';
    var i = 0;
    while (i++ < 500) {
      actual += 'a foo unified diff ';
    }
    var expected = 'a bar unified diff';

    var output = generateDiff(actual, expected);

    expect(output, 'to match', /output truncated/);
  });

  it("should truncate overly long 'expected' ", function () {
    var actual = 'a foo unified diff';
    var expected = '';
    var i = 0;
    while (i++ < 500) {
      expected += 'a bar unified diff ';
    }

    var output = generateDiff(actual, expected);

    expect(output, 'to match', /output truncated/);
  });

  it("should not truncate overly long 'actual' if maxDiffSize=0", function () {
    var actual = '';
    var i = 0;
    while (i++ < 120) {
      actual += 'a bar unified diff ';
    }
    var expected = 'b foo unified diff';

    // sinon.stub(Base, 'maxDiffSize').value(0);
    var output = generateDiff(actual, expected);

    expect(output, 'not to match', /output truncated/);
  });

  it("should not truncate overly long 'expected' if maxDiffSize=0", function () {
    var actual = 'a foo unified diff';
    var expected = '';
    var i = 0;
    while (i++ < 120) {
      expected += 'a bar unified diff ';
    }

    // sinon.stub(Base, 'maxDiffSize').value(0);
    var output = generateDiff(actual, expected);

    expect(output, 'not to match', /output truncated/);
  });
});