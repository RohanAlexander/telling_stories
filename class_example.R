## Load libraries

library(opendatatoronto)
library(tidyverse)
library(lubridate)

## Get data

marriage_licence_packages <- search_packages("Marriage Licence Statistics")

marriage_licence_resources <- marriage_licence_packages %>%
  list_package_resources()

marriage_licence_statistics <- marriage_licence_resources %>%
  filter(name == "Marriage Licence Statistics Data") |> 
  get_resource()

## Clean data

marriage_licence_statistics <- 
  marriage_licence_statistics |> 
  separate(col = TIME_PERIOD, 
           into = c("Year", "Month"),
           sep = "-") |> 
  mutate(Day = 1,
         Year = as.numeric(Year),
         Month = as.numeric(Month)) |> 
  mutate(date = paste(Year, Month, Day, sep = "-")) |> 
  mutate(date = ymd(date))
  
## Make graph 

marriage_licence_statistics |> 
  ggplot(aes(x = date,
             y = MARRIAGE_LICENSES,
             color = CIVIC_CENTRE)) +
  geom_point() +
  labs(x = "Date",
       y = "Number of licenses",
       color = "Location")
  

