# TODO

Brinks & Jynx

- add passive effects/types
- add sticker effects/types
- randomize passives/stickers each time a pack is opened

- add goal reroll tokens
- price of lives increases over time

- add ability to add passives
- add ability to apply sticker to face

- fix gameover

- more card/goal/reward scaling
- full house .etc are done by putting multiple goals on a single card (2 pair, full house, 3 pair, double triplet.etc)

- finish shop ui
- card reroll animation
- boss goals?
- need a way to see what stickers are on a die?
- allow locking goals?
- show score calculation for hand better
- gain interest by not spending money?
- don't allow submitting without at least one goal?
- ensure displayed cards are always of different variants?

- playtest and adjust scaling

# game loop

If you roll a black cat, You lose a life. If you run out, game over.
between rolls, you can tap/untap dice. Tapped dice are not rolled.
When you submit, your dice are scored. Goals completed multiply your score
you go to the store every 5 rounds. you can exchange chips for upgrades

# hand types to implement

parity set:

- all numbers are of the same parity, score based on count of numbers \* x.
- Goal could increase this value, and request a specific size of parity set. could also be prime numbers

specific series:

- fibonachi, pi, euler.
- Score based on how many numbers in the series you can submit

# passive ideas

Lucky Paw: Gain 1 life each time you submit
Nine Lives: Once per game, on game over, recover somehow
Scavenger: Gain x currency each time you submit
Die Hard: gain extra currency each submit based on how many lives you have left
Collector: Gain extra currency based on dice variety
gains lives over time with interest, sell for lives

# dice upgrades (stickers)

vampire: when this face is submitted, gain 1 life (legendary)
wild: Makes face count any number (legendary)
reroll: when this face is submitted, gain a goal reroll (rare)
split: value on this face can be off by 1 to satisfy goals (rare)
clone: face counts as 2 instances of its value (uncommon,rare)
multi: face adds multi when submitted (uncommon,rare)
base: fade adds base score when submitted(common,uncommon,rare)
number: makes face count as this number in addition to its existing value (common)
