![[Pasted image 20230127091800.png]]
Wystarczy coś takiego?
return (interface->type == HSL_IF_TYPE_IP && interface->sub_type == HSL_IF_SUBTYPE_TUNNEL);
Co do prefixu widzę, że po tej zmianie jest użyty tylko w unit testach + dmp_tunell_if_ssc.c 
Jeśli w tym pliku nie się nie pozbywamy prefixu to proponuję w dpm_tunnel_if.h czyli w miejscu gdzie to makro jest zdefiniowane zmienić
\#define DPM_NETDEV_TUNNEL_IF_NAME_PREFIX   "iptun"
na to co jest w npa_netdev.h czyli
/**
 * @details The prefixes to be used in Linux for different interface types.
 */

\#if defined(DUSG3)
\#define NPA_NETDEV_TUNNEL_IF_NAME_PREFIX   "adktun"
\#else
\#define NPA_NETDEV_TUNNEL_IF_NAME_PREFIX   "iptun"
\#endif


![[Pasted image 20230126151955.png]]
Nazwa INET6_ADDRSTRLEN jest wzięty z usr/netinet.in.h  (część gnu C library)
Co do nazwy ip_address_str -> ip_address_as_text jest bardziej czytelne, ale czy napewno jest sens definiować nową stałą jak już taka istnieje, a nie można jej zmienić? Nie lepiej trzymać się jakiegoś standardu, żeby dla każdego pliku nie było innej stałej?

---
Sprawdzić która wersja powinna się pojawić

![[Pasted image 20230126152809.png]]

---
![[Pasted image 20230126154921.png]]

To znaczy przed dpm_send_garps_forInterface? Jeśli tak to nie lepiej jak w tym będzie wywołane? W przeciwnym wypadku będzie trzeba powtarzać kod w 3 miejscach

---
![[Pasted image 20230127102038.png]]



---
### Lista zmian do msg

1. hsl_ifmgr.h 
	1. Nowa flaga HSL_IFMGR_GARP_SENDING_ACTIVE
2. dpm_stack
	1. dpm_send_garps_for_interface - async_fallback parameter-  determines whether sending garp should be performed
	2. Added flag to indicate adresses to send garp
	3. garp sending if it's necssesary
	4. validation for a additional corner cases
3. sta - checking flags for interface on linux