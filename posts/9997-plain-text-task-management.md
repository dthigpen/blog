# My Task Management System in Plain Text
tags: todotxt, plaintext

I've used todo.txt for my task lists for a while now, long enough to see where it shines and where it falls short. In this post, I'll share what todo.txt is, how I use it day to day, why it works for me, and why it might not fit everyone's workflow.

## What is todo.txt?

Todo.txt is a plain-text format for keeping track tasks. Since it's a plain-text format, you don't *need* any special software to view or edit your Todo, anything that can open a text file will do. It supports most of the usual task related features like due dates, tags, priorities, creation and completion dates. You can read more about the format on [GitHub](https://github.com/todotxt/todo.txt) but here is a quick introduction on the syntax:

### Creation, Completion, and Due Dates

An open task can have a date at the beginning to denote when it was created.

```
2025-10-02 Check mail
```

An optional due date can be denoted with the general `key:value` syntax, using `due:<date>`.

```
2025-10-02 Check mail due:2025-10-04
```

A task can be completed by prefixing the line with a lowercase `x` and a date, `x <completion-date> <creation-date> ...`
```
x 2025-10-05 2025-10-04 Check mail due:2025-10-04
```

### Priority

A task starting with a capital letter in parentheses denotes a priority
```
(A) 2025-10-02 Check mail
```

### Contexts

A context can be used to indicate the place or location that a task will take place. For example, household projects may have `@home`, while email reminders might have `@email`, but you can use them however you like.

```
2025-10-02 Check mail @home
```

### Extensions

There isn't much else beyond that for the todo.txt format. That's why it's encouraged to extend it with `key:value` pairs. Due date was an example of this that we saw earlier, another might be `rec:1w` for an app that supports recurring todo.txt tasks.

## Why todo.txt?

One of the biggest reasons I use todo.txt is that it's just a text file. It's freeing to know that my task list isn't tied to an app, service, account, or subscription. It's simply a plain file that I can open and edit anywhere.

Most digital productivity tools these days trade flexibility for convenience. They have polished apps on various platforms, will sync your data seamlessly across the clouds, and integrate (way too many) AI features, but often at the expense of locking you in with proprietary formats and limited export options. With plain text, you don't have to worry about any of that. You can read, edit, and move you list however you want.

For me, it comes down to a few simple principles:

- **You own your data**: No vender lock-in, no disappearing services.
- **Simple and Understandable**: No endless options to get lost in, just your tasks right in front of you.
- **Extensible**: Being plain text, anyone can build tools or scripts around it. If something's missing, you can create it.

## Day to Day

I keep my todo.txt file on my phone, that’s where I add most of my tasks and check them off throughout the day. Since it’s just a text file, I use Markor, a simple but capable editor that has integrations for editing todo.txt files easily. I like that it doesn’t force a specific layout or workflow; it just gets out of the way.

Even though I mostly manage tasks on my phone, I keep the file synced across all my devices with Syncthing. That way, I can review or update it from my tablet or laptop if the need arises. It's reassuring knowing it’s all local, no accounts or servers involved.

I’ve also made a few small tweaks to make it my own. I wrote a script that updates my phone wallpaper with my top tasks for the day. It works well with the minimal launcher that I use and always keeps my tasks visible at a glance. Within the file, I use a few recurring contexts like `@home`, `@out`, and `@car` to group tasks by where I can do them. I also tag them with simple project labels like `+chore`, `+fun`, or `+quick`, just enough structure to stay organized without overcomplicating things.

This setup has been working well for me because it’s lightweight, flexible, and easy to adapt as I change over time. It doesn't have all the bells and whistles, but it fits how I think and work!
