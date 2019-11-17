# Cadaver

A minimal [Snowman](https://github.com/videlais/snowman)-based Twine 2 story format for densely variable prose.

Snowman was originally created by Chris Klimas.  Cadaver additions are written by Derek Timm-Brock.

## What does Cadaver offer?

Cadaver is used for writing prose which looks static to the end user, but in fact has a plethora of swaps and variations available to the author.

Variables are set on the state, and those variables are used to evaluate variable blocks of text which match that state.

### Inline Tables

Tables are the workhorse for Cadaver.  A Cadaver table is composed of a reference to a property on the state and a series of options for what text to output if the variable is that option:

```
:: Prose
"Hello there," I said.

%SHAKES_HANDS
=YES [
I extended my hand, and he shook it.
]
=NO [
I descended into a respectful bow.
]

"It's a pleasure to meet you," he said.

state = {
  SHAKES_HANDS: "YES"
}

// output text

"Hello there," I said.

I extended my hand, and he shook it.

"It's a pleasure to meet you," he said.

```

### Variable Passages

Tables may also be dropped in by reference.  Passages tagged "cadaver" are detected upon story setup and stored for later use.  When the name of that passage is used as a reference, it will be evaluated and dropped into the text:

```
:: MY_GOOD_RESPONSE [cadaver]
%MOOD
=CONTRITE
[
"Sorry about that. I didn't realize."
]
=SURLY
[
"You could have mentioned it earlier"
]

:: Prose
I frowned. %MY_GOOD_RESPONSE%.

// state setup

state = {
  MOOD: "SURLY"
}

// output text

I frowned. "You could have mentioned it earlier"
```

## What does Cadaver use?

Like Snowman, it includes the JavaScript libraries [jQuery](https://jquery.com/) and [Underscore](https://underscorejs.org/).  Additional styling options are supplied through the inclusion of the [Marked](https://github.com/markedjs/marked) library.

## Want to learn more?

The [official Snowman documentation](https://videlais.github.io/snowman/2/) has more details about Snowman including multiple examples of how to do various tasks.

## Building

Run `npm install` to install dependencies.

`npm run build` will create a Twine 2-ready story format under `dist/`.

To check for style errors, run `npm run lint`.
To run unit tests, run `npm run test`.
