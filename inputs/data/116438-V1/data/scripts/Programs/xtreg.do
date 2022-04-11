********************************************************************************
********************************************************************************
* Function performing xtreg estimations
********************************************************************************
********************************************************************************

global empty " "

args y interest fe1 news_level_control trend seo weight begin end

local x1 "`interest'"

if "`news_level_control'"=="0" {
	local x5 "$empty"
	}
	else {
		local x5 "ln_etotal_cst"
		}		
		
if "`trend'"=="0" {
	local x4 "$empty"
	}
	else {
		local x4 "pqn_trend"
		}				
				
if  "`fe1'"=="0" {
	local fe1 "$empty"
	}
	else {
		local fe1 "i.`fe1'"
		}
			
if  "`seo'"=="0" {
	local clu "robust"
	}
	else if "`seo'"== "beta" {
			local clu "beta"
		}
			else if "`seo'"== "boot" {
			local clu "vce(bootstrap,rep(1000))"
			}
			else {
				local clu "cluster(`seo')"
				}
				
if  "`weight'"=="0" {
	local aweight "$empty"
	}
		else {
			local aweight "[aweight=qref]"
		}		
		
local start "`begin'"
local stop "`end'"		
		
char year[omit] `start'
eststo : xi :  xtreg `y' `x1' `x4' `x5' `fe1' if year>=`start' & year<=`end' `aweight', fe `clu'
