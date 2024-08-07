# PoyoSSG
Simple blog site generator! With themes and Markdown processing.
## How to use it
It's easy and simple to get started with PoyoSSG! First, upload your blog posts in .MD format into `src/posts`, They should contain metadata and should look like this:
```---
author: Poyo!
title: Why aren't Cookies free for everyone?
category: "international"
taxonomies:
  tags: ["cookies", "international", "philosophy"] 
---

# Cookies.
Cookies are awesome things. I love cookies. They should be free for everyone. Cookies are incredibly cheap to make, and they are a great way to make people happy. So, why aren't cookies free for everyone? 
```

Directories will be automatically generated. Just be sure to run PoyoSSG with sudo or admin privileges.
Finally, run `node .` in the root directory and voilá! Your site has been generated.


## Templating
PoyoSSG uses EJS for templating. The default code generates a landing page with all the posts and their author.
