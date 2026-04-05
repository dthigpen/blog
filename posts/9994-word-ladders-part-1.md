# Word Ladders (and How to Generate Them in Python)
tags: python, sensorwatch, game

I recently stumbled a word game called a [word ladder](https://en.wikipedia.org/wiki/Word_ladder) while looking for small games I could make for my watch.

The premise is quite simple: start with one word, end with another, and change one letter at a time until you get there. For example:

`cold -> cord -> card -> ward -> warm`

Simple, but surprisingly satisfying, and it turns out to be a great fit for a tiny screen. In this post, I’ll walk through what word ladders are and how to generate them with a bit of Python.

## What Is a Word Ladder?

A word ladder is a puzzle where you transform one word into another by changing a single letter at a time.
Each step must be a valid word.

For example:
`cold -> cord -> card -> ward -> warm`

Each step changes just one letter, and every intermediate word is a real word.

Often, the goal is to find the *shortest* possible chain between the two words, which is where things get interesting.

## A Bit of History

Word ladders were actually invented by [Lewis Carroll](https://en.wikipedia.org/wiki/Lewis_Carroll) in the late 19th century. He originally called them "Doublets" when he first published them as word puzzles in a magazine.

They've stuck around in various forms ever since.

## Generating Word Ladders in Python

So what does it look like to actually generate these ladders?

It turns out this maps quite nicely to a graph problem.

### Step 1: Loading Words

We need a list of valid words so that all intermediate words make sense. In the next post we will refine the word list, but for now anything will do as long as the words are all the same length (4 or 5 letters).

```python
def load_words(path: str):
    with open(path) as f:
        return set(word.strip().lower() for word in f)

words = load_words('words.txt')
```

### Step 2: Find Neighboring Words

We need to find the "neighbors" for each word that are one letter away. This will give us all the valid moves that a player can make for each intermediate word.

```python
import string

def neighbors(word: str, words: set[str]):
    for i in range(len(word)):
        for c in string.ascii_lowercase:
            if c != word[i]:
                candidate = word[:i] + c + word[i+1:]
                if candidate in words:
                    yield candidate
```

For each letter in the given word, we try to replace it with each letter of the alphabet. If the new word is valid, it's a neighbor. For example, `neighbors('cold', words)` might yield: `cord`, `sold`, `bold`, `...`.

### Step 3: Search For a Path

Now that we can get from one word to a neighboring word, we'd like to find the _shortest_ path of neighbors from the start word to the end. This can be done with a breadth-first search (BFS).

```python
from collections import deque

def find_ladder(start: str, end: str, words: set[str]):
    queue = deque([(start, [start])])
    visited = {start}

    while queue:
        word, path = queue.popleft()

        if word == end:
            return path

        for next_word in neighbors(word, words):
            if next_word not in visited:
                visited.add(next_word)
                queue.append((next_word, path + [next_word]))
```

The breadth-first nature ensures that the shortest path is returned first because BFS explores in order of increasing chain length.

### Example

```python
words = load_words("words.txt")
ladder = find_ladder("cold", "warm", words)

print(" -> ".join(ladder))
```

```
cold -> cord -> card -> ward -> warm
```

## Next Steps

Now that we can generate word ladder solutions, its probably a good time to go back and refine the word list we are using. That way we won't get chains with uncommon or nonsense intermediate words. Otherwise, you'll end up with chains like `cold -> bold -> bald -> wald -> warm`. _You_ might know what a wald is but I sure didn't until now. That'll make the game feel a lot more satisfying when we port it over to the watch.

Stay tuned for Part 2 in the series!