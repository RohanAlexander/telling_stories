********************************************************************************
********************************************************************************
* Date: November 2018
** Replication code: Angelucci, C. & J. Cage (2018): "Newspapers in Times of Low Advertising Revenues," Accepted, American Economic Journal: Microeconomics. 
********************************************************************************
********************************************************************************

clear
set more off, permanent

***** Write here the path to the folder 
****** Angelucci_Cage_AEJMicro (the downloaded folder)
global path "WRITE HERE PATH TO Angelucci_Cage_AEJMicro"

	*** paths to data 
	global data "$path/dta"
	global doing "$path/scripts"
	global res "$path/results"
		global figures "$res/figures"
		global tables "$res/tables"
		

********************************************************************************
********************************************************************************
*** Empirical Analysis
********************************************************************************
********************************************************************************


use "$data/Angelucci_Cage_AEJMicro_dataset.dta", clear


********************************************************************************
* Tables 1 & 2
* For descriptive statistics, normalize revenues, expenditures, etc. in million euros
preserve
	foreach var of varlist rtotal_cst ra_cst rs_cst etotal_cst profit_cst {
		replace `var'=`var'/1000000
		}

	label var rs_cst "Revenues from sales (million \euro)"
	label var ra_cst "Revenues from advertising (million \euro)"
	label var rtotal_cst "Total revenues (million \euro)"
	label var etotal_cst "Total expenditures (million \euro)"
	
	global stat_des po_cst ps_cst ads_p4_cst rtotal_cst ra_cst rs_cst ra_s nb_journ qtotal qs_s pages news_hole ads_q 

	eststo clear
	estpost sum $stat_des if local==0, d
	eststo : esttab using "$tables/Table1.tex", label replace ///
		cells("mean(fmt(1 1 1 0 0 0 1 0 %15.0fc 1 0) label(Mean)) p50(fmt(1 1 1 0 0 0 1 0 %15.0fc 1 0) label(Median)) sd(fmt(1 1 1 0 0 0 1 0 %15.0fc 1 0) label(sd)) min(fmt(1 1 1 0 0 0 1 0 %15.0fc 1 0) label(Min)) max(fmt(1 1 1 0 0 0 1 0 %15.0fc 1 0) label(Max)) count(fmt(%15.0fc) label(Obs))") ///
		nonum noobs ///
		refcat(po_cst "\textbf{Prices}" rtotal_cst "\textbf{Revenues \& journalists}" qtotal "\textbf{Circulation}" pages "\textbf{Content}", nolabel) 

	eststo clear
		estpost sum $stat_des if local==1, d
		eststo : esttab using "$tables/Table2.tex", label replace ///
		cells("mean(fmt(1 1 1 0 0 0 1 0 %15.0fc 1 0) label(Mean)) p50(fmt(1 1 1 0 0 0 1 0 %15.0fc 1 0) label(Median)) sd(fmt(1 1 1 0 0 0 1 0 %15.0fc 1 0) label(sd)) min(fmt(1 1 1 0 0 0 1 0 %15.0fc 1 0) label(Min)) max(fmt(1 1 1 0 0 0 1 0 %15.0fc 1 0) label(Max)) count(fmt(%15.0fc) label(Obs))") ///
		nonum noobs ///
		refcat(po_cst "\textbf{Prices}" rtotal_cst "\textbf{Revenues \& journalists}" qtotal "\textbf{Circulation}" pages "\textbf{Content}", nolabel) 
restore	


********************************************************************************
*** Table 3
tsset id_news year	
eststo clear 
foreach ys of varlist ln_ra_cst2 ln_ads_p1_cst2 ln_ads_p4_cst ln_ads_q { 
	do "$doing/Programs/xtreg.do" `ys' "after_national" "year" 0 0 id_news 0 1960 1974
		estadd local NewsFE "Yes", replace
		estadd local YearFE "Yes", replace
	}			
eststo : esttab using "$tables/Table3.tex", ///
replace keep(after_national)  nogap cells(b(star fmt(2)) se(par fmt(2))) ///
star(* 0.10 ** 0.05 *** 0.01) ///
stats(NewsFE YearFE r2 r2_a N, fmt(0 0 %9.2f %9.2f %15.0fc) ///
labels("Newspaper FE" "Year FE" R-sq "Adjusted R-sq" Observations)) label collabels(none)  ///
nonum	


********************************************************************************
*** Table 4
tsset id_news year	
eststo clear 
foreach ys of varlist ln_ps_cst ln_po_cst ln_qtotal ln_qs_s ln_rs_cst { 
 	do "$doing/Programs/xtreg.do" `ys' "after_national" "year" 0 0 id_news 0 1960 1974
		estadd local NewsFE "Yes", replace
		estadd local YearFE "Yes", replace
	}		
eststo : esttab using "$tables/Table4.tex", ///
replace keep(after_national)  nogap cells(b(star fmt(2)) se(par fmt(2))) ///
star(* 0.10 ** 0.05 *** 0.01) ///
stats(NewsFE YearFE r2 r2_a N, fmt(0 0 %9.2f %9.2f %15.0fc) ///
labels("Newspaper FE" "Year FE" R-sq "Adjusted R-sq" Observations)) label collabels(none)  ///
nonum


********************************************************************************
*** Table 5
tsset id_news year	
eststo clear 
foreach ys of varlist ln_nb_journ ln_av_payroll_cst ln_pages ln_news_hole { 
	do "$doing/Programs/xtreg.do" `ys' "after_national" "year" 0 0 id_news 0 1960 1974
		estadd local NewsFE "Yes", replace
		estadd local YearFE "Yes", replace
	}			
	do "$doing/Programs/xtreg.do" ln_share_Hard "after_national pqr_trend" "year" 0 0 id_news 0 1960 1974
		estadd local NewsFE "Yes", replace
		estadd local YearFE "Yes", replace
eststo : esttab  using "$tables/Table5.tex", ///
replace keep(after_national)  nogap cells(b(star fmt(2)) se(par fmt(2))) ///
star(* 0.10 ** 0.05 *** 0.01) ///
stats(NewsFE YearFE r2 r2_a N, fmt(0 0 %9.2f %9.2f %15.0fc %15.0fc) ///
labels("Newspaper FE" "Year FE" R-sq "Adjusted R-sq" Observations)) label collabels(none)  ///
nonum


********************************************************************************
*** Table 6
tsset id_news year	
* 6 (a) Education
eststo clear 
foreach ys of varlist R_sh_edu_no_ipo R_sh_edu_primaire_ipo R_sh_edu_secondaire_ipo R_sh_edu_sup_prof_ipo { 
	do "$doing/Programs/xtreg.do" `ys' "after_national" "year" 0 0 id_news 0 1960 1974
		estadd local NewsFE "Yes", replace
		estadd local YearFE "Yes", replace
	}			
eststo : esttab using "$tables/Table6a.tex", ///
replace keep(after_national)  nogap cells(b(star fmt(2)) se(par fmt(2))) ///
star(* 0.10 ** 0.05 *** 0.01) ///
stats(NewsFE YearFE r2 r2_a N, fmt(0 0 %9.2f %9.2f %15.0fc) ///
labels("Newspaper FE" "Year FE" R-sq "Adjusted R-sq" Observations)) label collabels(none)  ///
nonum	
* 6 (b) Socio-professional category
eststo clear 
foreach ys of varlist R_sh_pcs_agri_ipo R_sh_pcs_patron_ipo R_sh_pcs_cadre_ipo R_sh_pcs_employes_ipo R_sh_pcs_ouvriers_ipo R_sh_pcs_inactifs_ipo { 
	do "$doing/Programs/xtreg.do" `ys' "after_national" "year" 0 0 id_news 0 1960 1974
		estadd local NewsFE "Yes", replace
		estadd local YearFE "Yes", replace
	}			
eststo : esttab using "$tables/Table6b.tex", ///
replace keep(after_national)  nogap cells(b(star fmt(2)) se(par fmt(2))) ///
star(* 0.10 ** 0.05 *** 0.01) ///
stats(NewsFE YearFE r2 r2_a N, fmt(0 0 %9.2f %9.2f %15.0fc %15.0fc) ///
labels("Newspaper FE" "Year FE" R-sq "Adjusted R-sq" Observations)) label collabels(none)  ///
nonum


********************************************************************************
*** Table 7
tsset id_news year	
eststo clear 
foreach ys of varlist ln_ra_cst ln_ads_p4_cst ln_ps_cst ln_qs_s ln_nb_journ ln_news_hole { 
	preserve 
		drop if Had==1 & national==1
		do "$doing/Programs/xtreg.do" `ys' "after_national" "year" 0 0 id_news 0 1960 1974 0
			estadd local NewsFE "Yes", replace
			estadd local YearFE "Yes", replace
	restore
	preserve		
		drop if Had==0 & national==1
		do "$doing/Programs/xtreg.do" `ys' "after_national" "year" 0 0 id_news 0 1960 1974 0
			estadd local NewsFE "Yes", replace
			estadd local YearFE "Yes", replace
	restore		
	}			
eststo : esttab using "$tables/Table7.tex", ///
replace keep(after_national)  nogap cells(b(star fmt(2)) se(par fmt(2))) ///
star(* 0.10 ** 0.05 *** 0.01) ///
stats(NewsFE YearFE r2 r2_a N, fmt(0 0 %9.2f %9.2f %15.0fc) ///
labels("Newspaper FE" "Year FE" R-sq "Adjusted R-sq" Observations)) label collabels(none)  ///
nonum ///
mgroups("Ad revenues" "(Listed) Ad price" "Subscription price" "Share of subscribers" "Number of journalists" "Newshole", pattern(1 0 1 0 1 0 1 0 1 0 1 0) prefix(\multicolumn{@span}{c}{) suffix(}) span erepeat(\cmidrule(lr){@span})) ///
mlabels("Low" "High" "Low" "High" "Low" "High" "Low" "High" "Low" "High" "Low" "High", pattern(1 1 1 1 1 1 1 1 1 1 1 1) prefix(\multicolumn{@span}{c}{) suffix(}) span erepeat(\cmidrule(lr){@span}))


********************************************************************************
*** Figure 1
use "$final/Angelucci_Cage_AEJMicro_Descriptive_evidence_US", clear

twoway (connected newspapers year, sort msymbol(square) msize(small)) ///
(connected nb_journ year, sort msymbol(circle) msize(small) lpattern(dash) yaxis(2)),  ///
xlabel(1980(2)2016, angle(45) labsize(small)) ///
ylabel(10000 "10,000" 20000 "20,000" 30000 "30,000" 40000 "40,000" 50000 "50,000", labsize(small) angle(horizontal)) ///
ylabel(30000 "30,000" 35000 "35,000" 40000 "40,000" 45000 "45,000" 50000 "50,000" 55000 "55,000" 60000 "60,000", labsize(small) angle(horizontal) axis(2)) ///
ytitle("Million US$", size(small)) ///
ytitle("Number of daily newspaper journalists", size(small) axis(2)) ///
xtitle(" ", size(small)) ///
xline(1980(2)2016, lstyle(grid)) ///
legend(row(2) size(small)) ///
graphregion(color(white))
graph export "$figures/Figure1.pdf", name(Graph) replace
	
	
********************************************************************************
*** Figure 2
use "$final/Angelucci_Cage_AEJMicro_Descriptive_evidence_advertising_industry", clear	
keep year adtv adpqn adpqr	
reshape long ad, i(year) j(media) string
replace media="National news" if media=="pqn"
	replace media="Local news" if media=="pqr"
	replace media="Television" if media=="tv"
generate order = 1 if media=="National news"
	replace order = 2 if media=="Local news"
	replace order = 3 if media=="Television"

graph bar ad, over(year, gap(10)) over(media, gap(50) sort(order)) ///
ytitle("Million (constant 2014) euros", size(small)) ///
ylabel(0(200)1000, labsize(small) angle(horizontal)) ///
graphregion(color(white)) legend(size(vsmall))
graph export "$figures/Figure2.pdf", name(Graph) replace 	
	
	
********************************************************************************
*** Figure 3
use "$final/Angelucci_Cage_AEJMicro_Descriptive_evidence_advertising_industry", clear	
reshape long ad share, i(year) j(media) string
drop if media=="total"
generate order = 1 if media=="pqn"
	replace order = 2 if media=="pqr"
	replace order = 3 if media=="tv"
	replace order = 4 if media=="presse_mag"
	replace order = 5 if media=="radio"
	replace order = 6 if media=="affichage"
	replace order = 7 if media=="cine"
	replace order = 8 if media=="other"
		
replace media="Local daily newspapers" if media=="pqr"
	replace media="National daily newspapers" if media=="pqn"
	replace media="TV" if media=="tv"
	replace media="Radio" if media=="radio"
	replace media="Magazines" if media=="presse_mag"
	replace media="Outdoor" if media=="affichage"
	replace media="Cinema" if media=="cine"
	replace media="Others" if media=="other"
		
graph pie share, over(media) pie(1,explode) plabel(1 percent, format(%2.0f) size(*1.5) color(white)) ///
pie(2,explode)  plabel(2 percent, format(%2.0f) size(*1.5) color(white)) ///
pie(3,explode)  plabel(3 percent, format(%2.0f) size(*1.5) color(white)) ///
sort(order) ///
by(year, legend(size(vsmall)) graphregion(color(white)) note("")) ///
noclockwise ///
plotregion(lstyle(none))	
graph export "$figures/Figure3.pdf", name(Graph) replace 	
		
	
********************************************************************************
*** Figure 4
use "$final/Angelucci_Cage_AEJMicro_Descriptive_evidence_advertisement.dta"	, clear
		
* 4a
twoway (bar nb_PQN8 year, sort barw(0.4)) (bar nb_TV8 year, sort barw(0.1) yaxis(2)), ///
xlabel(1964(1)1972) ///
ylabel(0(1)4) ///
ytitle("Number of advertisements in National Newspapers", size(small)) ///
ytitle("Number of advertisements on TV", axis(2) size(small)) ///
title("Electronic devices and computer hardware (number)") ///
graphregion(color(white)) legend(row(2) size(vsmall))	
graph export "$figures/Figure4a.pdf", name(Graph) replace 	

* 4b
twoway (bar share_PQN8 year, sort barw(0.4)) (bar nb_TV8 year, sort barw(0.1) yaxis(2)), ///
xlabel(1964(1)1972) ///
ylabel(0(1)5) ///
ytitle("Share of advertisements in National Newspapers (%)", size(small)) ///
ytitle("Total number of advertisements on TV", axis(2) size(small)) ///
title("Electronic devices and computer hardware (share)") ///
graphregion(color(white)) legend(row(2) size(vsmall))	
graph export "$figures/Figure4b.pdf", name(Graph) replace 	

* 4c
twoway (bar nb_PQN22 year, sort barw(0.4)) (bar nb_TV22 year, sort barw(0.1) yaxis(2)), ///
xlabel(1964(1)1972) ///
ylabel(0(1)4) ///
ytitle("Number of advertisements in National Newspapers", size(small)) ///
ytitle("Number of advertisements on TV", axis(2) size(small)) ///
title("OTC Drugs (number)") ///
graphregion(color(white)) legend(row(2) size(vsmall))
graph export "$figures/Figure4c.pdf", name(Graph) replace 	
	
* 4d
twoway (bar share_PQN22 year, sort barw(0.4)) (bar nb_TV22 year, sort barw(0.1) yaxis(2)), ///
xlabel(1964(1)1972) ///
ylabel(0(.5)3) ///
ytitle("Share of advertisements in National Newspapers (%)", size(small)) ///
ytitle("Total number of advertisements on TV", axis(2) size(small)) ///
title("OTC Drugs (share)") ///
graphregion(color(white)) legend(row(2) size(vsmall))	
graph export "$figures/Figure4d.pdf", name(Graph) replace 	
		
	
********************************************************************************
*** Figure 5
use "$final/Angelucci_Cage_AEJMicro_Descriptive_evidence_television_quality.dta", clear

* 5a
twoway (connected nb_transmitters_all year, sort msize(small) mcolor(dknavy) lcolor(dknavy)) ///
(connected nb_transmitters_C1 year, sort msymbol(triangle) msize(vsmall) lpattern(dash) mcolor(red) lcolor(red)) ///
(connected nb_transmitters_C2 year, sort msymbol(square) msize(vsmall) lpattern(dash)  mcolor(green) lcolor(green)) ///
(connected nb_transmitters_C3 year, sort msymbol(diamond) msize(vsmall) lpattern(dash) mcolor(orange) lcolor(orange)) if year>=1962 & year<=1974, ///
xline(1967) ///
xlabel(1962(1)1974, labsize(vsmall) angle(45)) ///
ylabel(0(50)250, labsize(vsmall) angle(horizontal))	///
xtitle("", size(small)) ///
ytitle("Number of transmitters", size(vsmall)) ///
text(210 1969.5 "1972: introduction of 3rd channel", size(vsmall) place(se) box just(left) margin(l+1 t+1 b+1) width(31)) ///
graphregion(color(white)) ///
legend(row(2) size(vsmall) label(1 "All") label(2 "Channel 1") label(3 "Channel 2") label(4 "Channel 3"))
graph export "$figures/Figure5a.pdf", name(Graph) replace 	

* 5b
twoway (connected power_transmitters_all year, sort msize(small) mcolor(dknavy) lcolor(dknavy)) ///
(connected power_transmitters_C1 year, sort msymbol(triangle) msize(vsmall) lpattern(dash) mcolor(red) lcolor(red)) ///
(connected power_transmitters_C2 year, sort msymbol(square) msize(vsmall) lpattern(dash) mcolor(green) lcolor(green)) ///
(connected power_transmitters_C3 year, sort msymbol(diamond) msize(vsmall) lpattern(dash) mcolor(orange) lcolor(orange)) if year>=1962 & year<=1974, ///
xline(1967) ///
xlabel(1962(1)1974, labsize(vsmall) angle(45)) ///
xtitle("", size(small)) ///
ylabel(0 "0" 500 "500" 1000 "1,000" 1500 "1,500" 2000 "2,000" 2500 "2,500" 3000 "3,000", labsize(vsmall) angle(horizontal))	///
ytitle("Power of transmitters (kilowatt)", size(vsmall)) ///
graphregion(color(white)) ///
legend(row(2) size(vsmall) label(1 "All") label(2 "Channel 1") label(3 "Channel 2") label(4 "Channel 3")) //
graph export "$figures/Figure5b.pdf", name(Graph) replace 	

* 5c
twoway (connected Durée_Totale_C1 year, sort msymbol(triangle) msize(vsmall) mcolor(red) lcolor(red)) ///
(line Informations_C1 year, sort msymbol(triangle) msize(vsmall) lpattern(dash) mcolor(red) lcolor(red)) ///
(connected Durée_Totale_C2 year, sort msymbol(square) msize(vsmall) mcolor(green) lcolor(green)) ///
(line Informations_C2 year, sort msymbol(triangle) msize(vsmall) lpattern(dash) mcolor(green) lcolor(green)) if year>=1962 & year<=1971, ///
xline(1967) ///
xlabel(1962(1)1971, labsize(vsmall) angle(45)) ///
xtitle("", size(small)) ///
ylabel(0 "0" 500 "500" 1000 "1,000" 1500 "1,500" 2000 "2,000" 2500 "2,500" 3000 "3,000" 3500 "3,500" 4000 "4,000", labsize(vsmall) angle(horizontal)) ///
ytitle("Number of hours broadcast", size(vsmall)) ///
graphregion(color(white)) ///
legend(row(2) size(vsmall) order(- "1st channel" 1 2 - "2nd channel" 3 4) label(1 "All") label(2 "News") label(3 "All") label(4 "News"))
graph export "$figures/Figure5c.pdf", name(Graph) replace 	

* 5d
twoway (connected nb_redevances_total_ipo year, sort msize(small)) if year>=1962 & year<=1974, ///
xline(1967) ///
xlabel(1962(1)1974, labsize(vsmall) angle(45)) ///
xtitle("", size(small)) ///
ylabel(3(1)14, labsize(vsmall) angle(horizontal)) ///
ytitle("Number of license-fees (million)", size(vsmall)) ///
graphregion(color(white)) 
graph export "$figures/Figure5d.pdf", name(Graph) replace 	

* 5e
twoway (connected journalistes year, sort msize(small) mcolor(black) lcolor(black)) if year>=1960 & year<=1974, ///
xline(1967) ///
xlabel(1960(1)1974, labsize(vsmall) angle(45)) ///
ylabel(0(100)1200, labsize(vsmall) angle(horizontal))	///
xtitle("", size(small)) ///
ytitle("Number of journalists", size(vsmall)) ///
graphregion(color(white)) 
graph export "$figures/Figure5e.pdf", name(Graph) replace 	

		
********************************************************************************
*** Figure 6
use "$data/Angelucci_Cage_AEJMicro_dataset.dta", clear

* 6a - Advertising revenues
capture drop p
gen p=1
label var p "National*1960"
tsset id_news year	
set more off
do "$doing/Programs/xtreg.do" ln_ra_cst "p i.year*national" 0 1 0 id_news 0 1960 1974
coefplot, omitted vertical label ///
keep(p _IyeaXnat_1960 _IyeaXnat*) ///
yline(0) ///
ylabel(-1(.1).2, angle(horizontal) labsize(small)) ///
levels(90) ///
coeflabels(_IyeaXnat_1960 = "National*1960" _IyeaXnat_1961 = "National*1961" _IyeaXnat_1962 = "National*1962" _IyeaXnat_1963 = "National*1963" _IyeaXnat_1964 = "National*1964" _IyeaXnat_1965 = "National*1965" _IyeaXnat_1966 = "National*1966" _IyeaXnat_1967 = "National*1967" _IyeaXnat_1968 = "National*1968" _IyeaXnat_1969 = "National*1969" _IyeaXnat_1970 = "National*1970" _IyeaXnat_1971 = "National*1971" _IyeaXnat_1972 = "National*1972"  _IyeaXnat_1973 = "National*1973" _IyeaXnat_1974 = "National*1974") ///
xlabel(, angle(45) labsize(small)) ///
xline(7.5,lcolor(black) lpattern(dash)) ///
graphregion(color(white)) 
graph export "$figures/Figure6a.pdf", name(Graph) replace 	

* 6b - Advertising prive
capture drop p
gen p=1
label var p "National*1962"
tsset id_news year	
set more off
do "$doing/Programs/xtreg.do" ln_ads_p4_cst "p i.year*national" 0 0 0 id_news 0 1962 1974
coefplot, omitted vertical label ///
keep(p _IyeaXnat_1963 _IyeaXnat_1964 _IyeaXnat_1965 _IyeaXnat_1966 _IyeaXnat_1967 _IyeaXnat_1968 _IyeaXnat_1969 _IyeaXnat_1970 _IyeaXnat_1971 _IyeaXnat_1972 _IyeaXnat_1973 _IyeaXnat_1974) ///
yline(0) ///
ylabel(-1(.1).2, angle(horizontal) labsize(small)) ///
levels(90) ///
coeflabels(_IyeaXnat_1963 = "National*1963" _IyeaXnat_1964 = "National*1964" _IyeaXnat_1965 = "National*1965" _IyeaXnat_1966 = "National*1966" _IyeaXnat_1967 = "National*1967" _IyeaXnat_1968 = "National*1968" _IyeaXnat_1969 = "National*1969" _IyeaXnat_1970 = "National*1970" _IyeaXnat_1971 = "National*1971" _IyeaXnat_1972 = "National*1972"  _IyeaXnat_1973 = "National*1973" _IyeaXnat_1974 = "National*1974") ///
xlabel(, angle(45) labsize(small)) ///
xline(5.5,lcolor(black) lpattern(dash)) ///
graphregion(color(white))
graph export "$figures/Figure6b.pdf", name(Graph) replace 	

* 6c - Subscription price
capture drop p
gen p=1
label var p "National*1960"
tsset id_news year	
set more off
do "$doing/Programs/xtreg.do" ln_ps_cst "p i.year*national" 0 0 0 id_news 0 1960 1974
coefplot, omitted baselevels vertical label ///
keep(p _IyeaXnat*) ///
yline(0) ///
ylabel(-1(.1).2, angle(horizontal) labsize(small)) ///
levels(90) ///
coeflabels(_IyeaXnat_1960 = "National*1960" _IyeaXnat_1961 = "National*1961" _IyeaXnat_1962 = "National*1962" _IyeaXnat_1963 = "National*1963" _IyeaXnat_1964 = "National*1964" _IyeaXnat_1965 = "National*1965" _IyeaXnat_1966 = "National*1966" _IyeaXnat_1967 = "National*1967" _IyeaXnat_1968 = "National*1968" _IyeaXnat_1969 = "National*1969" _IyeaXnat_1970 = "National*1970" _IyeaXnat_1971 = "National*1971" _IyeaXnat_1972 = "National*1972"  _IyeaXnat_1973 = "National*1973" _IyeaXnat_1974 = "National*1974") ///
xlabel(, angle(45) labsize(small)) ///
xline(7.5,lcolor(black) lpattern(dash)) ///
graphregion(color(white))
graph export "$figures/Figure6c.pdf", name(Graph) replace 	

* 6d - Circulation
capture drop p
gen p=1
label var p "National*1960"
tsset id_news year	
set more off
do "$doing/Programs/xtreg.do" ln_qtotal "p i.year*national" 0 0 0 id_news 0 1960 1974
coefplot, omitted baselevels vertical label ///
keep(p _IyeaXnat*) ///
yline(0) ///
ylabel(-1(.1).2, angle(horizontal) labsize(small)) ///
levels(90) ///
coeflabels(_IyeaXnat_1960 = "National*1960" _IyeaXnat_1961 = "National*1961" _IyeaXnat_1962 = "National*1962" _IyeaXnat_1963 = "National*1963" _IyeaXnat_1964 = "National*1964" _IyeaXnat_1965 = "National*1965" _IyeaXnat_1966 = "National*1966" _IyeaXnat_1967 = "National*1967" _IyeaXnat_1968 = "National*1968" _IyeaXnat_1969 = "National*1969" _IyeaXnat_1970 = "National*1970" _IyeaXnat_1971 = "National*1971" _IyeaXnat_1972 = "National*1972"  _IyeaXnat_1973 = "National*1973" _IyeaXnat_1974 = "National*1974") ///
xlabel(, angle(45) labsize(small)) ///
xline(7.5,lcolor(black) lpattern(dash)) ///
graphregion(color(white))
graph export "$figures/Figure6d.pdf", name(Graph) replace 	

* 6e - Number of journalists
capture drop p
gen p=1
label var p "National*1960"
tsset id_news year	 
set more off
do "$doing/Programs/xtreg.do" ln_nb_journ "p i.year*national" 0 0 0 id_news 0 1960 1974
coefplot, omitted vertical label ///
keep(p _IyeaXnat*) ///
yline(0) ///
ylabel(-1.(.1).2, angle(horizontal) labsize(small)) ///
levels(90) ///
xlabel(, angle(45) labsize(small)) ///
coeflabels(_IyeaXnat_1960 = "National*1960" _IyeaXnat_1961 = "National*1961" _IyeaXnat_1962 = "National*1962" _IyeaXnat_1963 = "National*1963" _IyeaXnat_1964 = "National*1964" _IyeaXnat_1965 = "National*1965" _IyeaXnat_1966 = "National*1966" _IyeaXnat_1967 = "National*1967" _IyeaXnat_1968 = "National*1968" _IyeaXnat_1969 = "National*1969" _IyeaXnat_1970 = "National*1970" _IyeaXnat_1971 = "National*1971" _IyeaXnat_1972 = "National*1972"  _IyeaXnat_1973 = "National*1973" _IyeaXnat_1974 = "National*1974") ///
xline(7.5,lcolor(black) lpattern(dash)) ///
graphregion(color(white)) 
graph export "$figures/Figure6e.pdf", name(Graph) replace 

* 6f - News hole
capture drop p
gen p=1
label var p "National*1960"
tsset id_news year	
set more off
do "$doing/Programs/xtreg.do" ln_news_hole "p i.year*national" 0 0 0 id_news 0 1960 1974
coefplot, omitted vertical label ///
keep(p _IyeaXnat*) ///
yline(0) ///
ylabel(-1(.1).2, angle(horizontal)) ///
levels(90) ///
xlabel(, angle(45) labsize(small)) ///
coeflabels(_IyeaXnat_1960 = "National*1960" _IyeaXnat_1961 = "National*1961" _IyeaXnat_1962 = "National*1962" _IyeaXnat_1963 = "National*1963" _IyeaXnat_1964 = "National*1964" _IyeaXnat_1965 = "National*1965" _IyeaXnat_1966 = "National*1966" _IyeaXnat_1967 = "National*1967" _IyeaXnat_1968 = "National*1968" _IyeaXnat_1969 = "National*1969" _IyeaXnat_1970 = "National*1970" _IyeaXnat_1971 = "National*1971" _IyeaXnat_1972 = "National*1972"  _IyeaXnat_1973 = "National*1973" _IyeaXnat_1974 = "National*1974") ///
xline(7.5,lcolor(black) lpattern(dash)) ///
graphregion(color(white))	
graph export "$figures/Figure6f.pdf", name(Graph) replace 

* 6g - Readership: % employees
capture drop p
gen p=1
label var p "National*1960"
tsset id_news year	
set more off
do "$doing/Programs/xtreg.do" R_sh_pcs_employes_ipo "p i.year*national" 0 0 0 id_news 0 1960 1974
coefplot, omitted vertical label ///
keep(p _IyeaXnat_1960 _IyeaXnat*) ///
yline(0) ///
ylabel(-15(1)5, angle(horizontal) labsize(small)) ///
levels(90) ///
coeflabels(_IyeaXnat_1960 = "National*1960" _IyeaXnat_1961 = "National*1961" _IyeaXnat_1962 = "National*1962" _IyeaXnat_1963 = "National*1963" _IyeaXnat_1964 = "National*1964" _IyeaXnat_1965 = "National*1965" _IyeaXnat_1966 = "National*1966" _IyeaXnat_1967 = "National*1967" _IyeaXnat_1968 = "National*1968" _IyeaXnat_1969 = "National*1969" _IyeaXnat_1970 = "National*1970" _IyeaXnat_1971 = "National*1971" _IyeaXnat_1972 = "National*1972"  _IyeaXnat_1973 = "National*1973" _IyeaXnat_1974 = "National*1974") ///
xlabel(, angle(45) labsize(small)) ///
xline(7.5,lcolor(black) lpattern(dash)) ///
graphregion(color(white)) 
graph export "$figures/Figure6g.pdf", name(Graph) replace 	

* 6h - Readership: % farmers & laborers
capture drop p
gen p=1
label var p "National*1960"
tsset id_news year	
set more off
do "$doing/Programs/xtreg.do" R_sh_pcs_agri_ouvriers_ipo "p i.year*national" 0 0 0 id_news 0 1960 1974
coefplot, omitted vertical label ///
keep(p _IyeaXnat_1960 _IyeaXnat*) ///
yline(0) ///
ylabel(-11(2)17, angle(horizontal) labsize(small)) ///
levels(90) ///
coeflabels(_IyeaXnat_1960 = "National*1960" _IyeaXnat_1961 = "National*1961" _IyeaXnat_1962 = "National*1962" _IyeaXnat_1963 = "National*1963" _IyeaXnat_1964 = "National*1964" _IyeaXnat_1965 = "National*1965" _IyeaXnat_1966 = "National*1966" _IyeaXnat_1967 = "National*1967" _IyeaXnat_1968 = "National*1968" _IyeaXnat_1969 = "National*1969" _IyeaXnat_1970 = "National*1970" _IyeaXnat_1971 = "National*1971" _IyeaXnat_1972 = "National*1972"  _IyeaXnat_1973 = "National*1973" _IyeaXnat_1974 = "National*1974") ///
xlabel(, angle(45) labsize(small)) ///
xline(7.5,lcolor(black) lpattern(dash)) ///
graphregion(color(white))
graph export "$figures/Figure6h.pdf", name(Graph) replace 	
