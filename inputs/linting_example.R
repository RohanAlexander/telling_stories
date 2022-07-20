SIMULATED_DATA <-
  tibble(
    Division = c(1:150,151),
    Party = sample(
      x = c('Liberal'),
      size = 151,
      replace = T
    ))