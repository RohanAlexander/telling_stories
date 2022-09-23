test_that("Check coefficients", {
  expect_gt(sim_run_data_rain_model$coefficients[3], 0)
  expect_lt(sim_run_data_rain_model$coefficients[3], 20)
})