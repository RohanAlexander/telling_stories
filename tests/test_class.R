test_that("Check class", {
  expect_type(sim_run_data$marathon_time, "double")
  expect_type(sim_run_data$five_km_time, "double")
  expect_type(sim_run_data$was_raining, "character")
})

test_that("Check complete", {
  expect_true(all(complete.cases(sim_run_data)))
})