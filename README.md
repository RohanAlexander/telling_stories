# Telling Stories with Data

This is a book about foundational data skills, tentatively titled *Telling Stories With Data*. It was accepted for publication by CRC Press in May 2021. Much of the content is still in draft form, and I would appreciate comments, suggestions, or pull requests.


### 16 August 2022

Removed the `gt` examples in Ch 6 because it doesn't seem to work with Quarto. In May they said there will be updates to `gt` coming to make it play nicely with Quarto PDFs, so can probably add this back in at some point. 

### 28 August 2022

Issue with the `dataverse`. So have commented out:

```
library(jsonlite)

politics_datasets <-
  fromJSON("https://demo.dataverse.org/api/search?q=politics")
```
  
### 28 August 2022

Need to add an example of differential privacy.
  

### Check

- Check about installing `tidyverse` packages unnecessarily. And similarly, loading `tidyverse` unnecessarily.

### Phrases

Remove:

- "it is clear that"
- "easily"
- "In particular, " 
- "just"

Change:

- "folks" -> "people"
- one particular -> one
- and also -> and
- a large number of -> many
- take advantage of -> use
- 'tidyverse' -> 'the tidyverse'
- "we will" -> "we" (sometimes)

So there are a lot of unnecessary "So " at the start of sentences that can just be removed.


### Styler

- https://github.com/gadenbuie/grkstyle
- https://styler.r-lib.org/articles/styler.html
- Use build from here because of Quarto: https://issuehint.com/issue/r-lib/styler/913

