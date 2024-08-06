# PoyoSSG
Simple blog site generator! With themes and Markdown processing.
### How to use it
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

then, create a directory named `predist`. That's where the output of your website will be generated. after that, create another directory named `posts` inside `predist`. 

Finally, run `node .` in the root directory and voilá! Your site has been generated.
