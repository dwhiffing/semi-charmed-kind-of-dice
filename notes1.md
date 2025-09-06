# TODO

Brinks & Jynx

- upgrade die size
- upgrade die face
- add die (each new die costs more exponentially)

- don't allow submitting without at least one goal?

- more card/goal/reward scaling
- add goal reroll tokens
- full house .etc are done by putting multiple goals on a single card (2 pair, full house, 3 pair, double triplet.etc)
- ensure displayed cards are always of different variants?

- price of lives increases over time
- passive abilities
- finish shop ui
- card reroll animation
- boss goals?
- allow locking goals?
- show score calculation for hand better
- gain interest by not spending money?

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

# dice upgrades

Wild card: Makes face count as best possible value fore scoring.
Split Face: adds +/-x, face counts as that value as well as +/-x
Clover Face: When this face is submitted, adds x currency
Reroll Face: when this face is submitted, gain a goal reroll
Vampiric Face: when face is submitted, gain x lives
