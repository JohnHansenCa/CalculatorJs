# CalculatorJs
Calculator JS provides a traditional keypad, with unique features such as units, to provide calculator functionality primarily targeting mobile environments.

[A complete turn-key calculator can be found here*](https://johnhansenca.github.io/CalculatorJs/)
*Note current limitations below.

## About This Project ##
My overwhelming goal for the project is to see if features such as dimensions(units), built-in constants, etc. in a mobile calculator-style format can generate a better tool to understand and solve straightforward math problems.  To accomplish that goal several key accomplishments are required.
- Provide a complete turn-key calculator [progressive web app](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).
- Be able to quickly experiment with dimensions as used extensively in scientific and engineering calculations(see [unis](https://mathjs.org/docs/datatypes/units.html) for usage examples). I think this could be useful for users allowing them to more consistently generate correct results. The downside is the extra keystrokes to enter the dimension/unit information.
- Experiment with features such as the 'power triangle' to allow users to easier understand exponentiation, roots and bases.
- To add constants to easily support conversions between common commercial units such as tonnes and barrels, weight and volume, or fuel weight to BTU or Joules which are not easily found through google searches.
- To allow the user the ability to configure the calculator tuning it to specific needs.

## Built on Other Projects ##

- MathJS 
    - used as the calculator computing engine.
- KeyPadJs
    - provides keypad functionality such as popups and the ability to change key sets.
- KeyPadCss
    - provides styling for the keypad using HTML5/CSS3 technologies.

## Current Limitations ##
Here are the current limitations.  All these limitations will be removed as the project continues. Here are a few of the most glaring issues.
- It is not currently a progressive web app. You'll need to go to the [calculator link](https://johnhansenca.github.io/CalculatorJs/) every time you want to use the app.
- It is missing easy access to many Mathjs [constants, prefixes](https://mathjs.org/docs/datatypes/units.html), [dimensions](https://mathjs.org/docs/datatypes/units.html), and [buit-in functions](https://mathjs.org/docs/expressions/syntax.html). They can be accessed by typing them directly into the calculator.

# License #
[GNU Affero General Public License v3.0](https://github.com/JohnHansenCa/CalculatorJs/blob/main/LICENSE)