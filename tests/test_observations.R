test_that("Check number of observations is correct", {
  expect_equal(nrow(sim_run_data), 200)
})

test_that("Check complete", {
  expect_true(all(complete.cases(sim_run_data)))
})