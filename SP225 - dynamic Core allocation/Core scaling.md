[[Sp225]]

#DynamicAllocationHelper_java
#lpeiScaleDownEnableAndVeryfi:
- get available core range
	- #getCpuSet
		- check is dcat running
		- ./dcatli a getcpuset
- #enable_scaling 
	-  "mkdir -p /rcs/dev_patches; echo 1 > /rcs/dev_patches/cpus_dca_enabled"
	- echo mincores > /rcs/dev_patches/cpus_dca_dp_work_min
	- restart dut
- #getAvailableCoresForScaling
	- #getCurrentCoreLimits
		- getCpuLimits
			- is dcat not running - run
			- ./dcatli a getlimits
			- return text with limits
		- replace current: |min: |max  na "" i  split " "
		- każdą linię cast do int  i zapisz do limits[]
		- return limits
	- return limits[2] - limits[0]
- #taps taps -u -n npa*
- #checkScalingByCoreNumber - gets corePool that is cores available for scaling
	- getcpuset
	- 
	
