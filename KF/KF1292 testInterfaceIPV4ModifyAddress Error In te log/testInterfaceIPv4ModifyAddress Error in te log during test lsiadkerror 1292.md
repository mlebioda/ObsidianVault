https://eteamproject.internal.ericsson.com/browse/TNKF-1292

#### General informations
1. Test do sprawdzenia - testInterfaceIPv4ModifyAddress
2. Błąd prawdopodobnie pojawia się po auto update ADK do wersji 1.0.4.047_31 https://gerrit.ericsson.se/#/c/2923882/
3. log z reprodukcją https://fem1s11-eiffel142.eiffel.gic.ericsson.se:8443/jenkins/job/tn-PL4-g3/4306/JCAT_20Report/
4. Powiązany TR https://gerrit.ericsson.se/#/c/7184714/
5. Jako rozwiązanie TR było dorzucone czyszczenie ARP cache w testInterfaceIPv4ModifyAddress
6. Hi, right now it's not easy to reproduce the error, for the sake of analysis, i saw in ~~two years old~~ intel ticket a tip to delete all ARP entries (next hops) before deleting the IP interface it assigned to, i'm trying to apply this tip and trying to reproduce the error to see if it works fine. - sprawdzić
7. Błąd występuje na dusg3 - na g2 nie ma pliku, który powoduje błąd

---
### [[2023-01-30]] - progres
#### LOGI
1. puszczenie testów STP_K06
2. Ciężko z logów wyodrębnić konkretną przyczynę ponieważ w tn_lttn.log
	1. Jest około 160 :EXCEPTION: 
	2. Nie ma żadnego ERROR - jest za to _adk_ip:intel_adk_error:
1. Z trilogów wynika, że błąd pojawił się po usuwaniu  MOsów
	1. EthernetPort=TN_E
	2. TN_IDL_A_1
	3. TN_IDL_A_2
	4. TN_IDL_A_3
	5. TN_IDL_A_4
	6. TN_IDL_B
	7. TN_IDL_C
	8. TN_IDL_D
2.  8 RocBfdStaticRouteIPv4 ROS, 2 RocBfdStaticRouteIPv4 i 8 RocAddressIPv4
Sam błąd pojawia się po tych msgach o usunięciu MO i RO, a następnie po 

**\[2023-01-17 21:27:51.020260787] (+0.001429984) du1 com_ericsson_tn_ifm:INFO: { cpu_id = 3 }, { procname = "dpsd" }, { src = "hsl_fib.c:2315", obj = "ROUTE", msg = "delete_connected_route(): Deleting connected route for subnetwork: if_name=tn_e.132, subnetwork=10.225.3.112/29, prefix=10.225.3.114/29" }**\

\[2023-01-17 21:27:51.021241639] (+0.000980852) du1 com_intel_adk_ip:intel_adk_error: { cpu_id = 3 }, { procname = "npa-ipc-server" }, { Module_Name = "adk_ip", File_Name = "adk_ip_flow.c", Line_no = 1571, Debug_Info = "Error in removing IPv4 Egress Flow Id from dataplane
" }
\[2023-01-17 21:27:51.021248442] (+0.000006803) du1 com_intel_adk_ip:intel_adk_error: { cpu_id = 3 }, { procname = "npa-ipc-server" }, { Module_Name = "adk_ip", File_Name = "adk_ip_flow.c", Line_no = 1571, Debug_Info = "ADK_E_INTERNAL_ERROR
" }

#### KOD
1. usunięcie  connected route odbywa się w hsl_fib.c:2315 w metodzie **delete_connected_route**
2. z poziomu adk robi się to w adk_ip_flow.c -> **adk_ip_egress_flow_delete()** - 1571
	1. powodem błędu jest zwrócenie status ERROR przez **adk_ip_dp_egress_flow_remove**() który robi "Update the Hardware".
	2. **adk_sll_unlink_item** zawraca ADK_ERROR
	   *adk_sll_unlink_item -- unlink list item, having the given data value from the list  
		 it returns the list item pointer un-touched
		 on successful unlink operation, API caller will have  
		 he responsibility of the list item returned.  
		 (e.g. freeing memory.)  
		 ADK_DP_SHM_FREE() should be used to free list item memory.
		 Returns:  
ADK_SUCCESS on successful unlink operation.  
Following error codes on failure  
1. ADK_E_LIST_INVALID_LIST if invalid list  
2. ADK_E_LIST_NOT_FOUND if item not found  
3. ADK_E_INVALID_PARAMETER if invalid li_item pointer*

Args:  
list_p -- the list  
data -- data in the list that needs to unlink  
li_item -- unlinked list item (output)
	3. 

---
### Problemy
1. Ping should succeed
2. Failed to navigate to LDN
3. https://tnjcatlogs.npee.gic.ericsson.se/eiecbml/jcat_tn_logs/202301/KF1292/20230130104450/index_catlog_offline.html - tylko pojawiają się 2 powyższe błędy, nie generuja nawet ESI - K06 - to G3, chyba powinienem G2 sprawdzić
4. 

---
#### TODO
- sprawdzić stan interfejsu w trakcie błędu https://mhweb.ericsson.se/TREditWeb/faces/oo/object.xhtml?eriref=HY33404 - powinno być naprawione w https://gerrit.ericsson.se/#/c/7184714/
- https://mhweb.ericsson.se/TREditWeb/faces/oo/object.xhtml?eriref=HW53310 check - 
- https://eteamproject.internal.ericsson.com/browse/TNKF-1292 sprawdź wątek

adk_ip_dp_egress_flow_remove

 if(ADK_SUCCESS != status /*(adk_sll_unlink_item(

            ip_module_info->ip_dp_tbl_info_p->ip_egress_ovflow_list_head,

            &overflow_data,

            &current,

            NULL,

            (adk_sll_cmp_f *)adk_ip_hash_overflow_list_cmp_cb_func))*/)

        return ADK_DP_E_ERROR;


if(status == ADK_SUCCESS) {

          ADK_IPV4_LOG_INFO(ipHandle, "@ML - adk_ip_dp_egress_flow_remove - ADK_SUCCESS");

     } else if(status == ADK_E_LIST_INVALID_LIST) {

          ADK_IPV4_LOG_INFO(ipHandle, "@ML - adk_ip_dp_egress_flow_remove - ADK_E_LIST_INVALID_LIST");

     } else if (status == ADK_E_LIST_NOT_FOUND){

          ADK_IPV4_LOG_INFO(ipHandle, "@ML - adk_ip_dp_egress_flow_remove - ADK_E_LIST_NOT_FOUND");

     } else if(status == ADK_E_INVALID_PARAMETER) {

          ADK_IPV4_LOG_INFO(ipHandle, "@ML - adk_ip_dp_egress_flow_remove - ADK_E_INVALID_PARAMETER");

     } else {

          ADK_IPV4_LOG_INFO(ipHandle, "@ML - adk_ip_dp_egress_flow_remove - Undefined behaviour");

     }