https://ericsson-my.sharepoint.com/:p:/p/pawel_kuzminski/ESTDS5iSABVBhDjQeJbP3pYBIKBrtcMumStNo8H2KuIdnA
#OVP - Overload Protection

1. OVP jest na poziomach
	1. FastPath - #ETH_BD Ethernet Bridge Driver
	2. Slow Path - CPPI Bridge Driver \[Traffic towards Linux] + ADK DP rate limiting for Packet Handlers \[Traffic towards TN]
2. OVP veryfies overload protection of FP & SP works:
	1. traffic terminated within FP -> FPS application
	2. trafic forwarded within FP
	3. traffic terminated in Linux
	4. traffic terminated in TN (via Packet Handler interface)


![[Pasted image 20230202102306.png]]



### Słownik
#SlowPath - inne pakiety np do Linuxa albo packet handlera (arp, oam pakiety, pcp, udp nie fp)
#FastPath - ebcom i rzeczy tunelowane idące z radia. Np udp, które jest ustalone w udp sesji wystawione przez Rata. Wszystko co przychodzi z emki. W sesji jest przerabiane to co przechodzi na core network
#EMka - baseband module - trzeba by zajrzeć do prezentacji z arch urządzenia (moduł jak snowridge) Moduł, który jest na drodze. Ebcom wysyłany do emki a ona wysyla do cpri i do radio unitu i na odwrót Lynx. Nie testujemy emki. EBCOMA odsyłamy na port do TN, a normalnie poszedłby na emke, ale nie testujemy end2end. IPT wysyła paczkę testową z ustawieniami switcha
#ADKDataPlane-  Procesowanie pakietów z danymi mniejszy priorytet niż cp
#ControlPlane - sterujące urządzeniem
#SynchPlane - do synchronizacji
#CPPI_BD- control packet procesing bridge driver - współpracuje z adk net driver
#PH - packet handler
#CPK - Columbia park - skedżuler pakietów - potem to bd obsługuje pakiety
#FPS_APP - 
#Tx - transived = 
#rx - pakiety - received do eth bd

### FP OVP HW LVL
1. Ścisła priorytetyzacja na HLP Port 20 \[ingress traffic from HLP towards CPK] - **no tn configuration**
2. Mamy niebezpośrednio skonfigurowane długości tx kolejek HLP PORT 20 
3. Jak odpowiadają do TCs/Pcps, unikamy inwersji priorytetów pomiędzy wyższym i niższym PCPs. Są inne dla bordów wysokiej i niskiej pojemności
4. Konfiguracaj jest zaaplikowana przez RCS na starcie systemu i może być wyświetlona korzystająć z HLP command shel *show qos attr port 20* 

![[Pasted image 20230202153203.png]]
1. #ETH_BD to event buffer, który mamy tu zdefiniowany - odgrywa rolę tymczasowego cache gdy DP ingress event queue jest pełna
2. Jest też zdefiniowany dorp threshold dla każdego #RX queue - wyrażone w procencie rozmiaru Event buffera - pakiety zebrane z danego #RX queue do zajęcia Event bufferam nie jest większa niż wartość drop threshold  wyrażona jako numer wpisu buffera
3. Jest skonfigurowany servicing weight dla każdego #RX queue - to jest użyte do implementacaji WRR on ingress packets - #RX queues są zmapowane do #PCP, zatem to pozwala na achiever prioritization of ingres traffiic based on PCP value int VLAN header

![[Pasted image 20230202153901.png]]
Tn tworzy ADK netdev jako CPPI devce, które wymienia pakiety z #ADK_Netdriver.
Adk netdev ma zdefiniowane 8 #RX i 8 #TX queues.
#TX queues przekazujące traffic do linuxa są priorytetyzowane \[different servicing weights] - scheduled RR (Round Robin).
#RX queues przekazujące ruch do linuxa nie są priorytetyzowane (te same wagi) = sheduled RR
#RX queues są skonfigurowane do przetworzenia pewnych traffic flows  - tylko 4 kolejki są w użyciu - {2,//othrer 1, //ARP 2, //Exceptions 10, //SCTP, 1,1,1,1}

Do każdej z #RX queues dołączamyu  ingress RL (RAte limiting) quos queue z parametrami wyrażonymi w #PPS (packet per second)/
#CPPI_BD- zarejestrowany callback  adk_sys_dp_slowpath_protection() does rate limiting.
#CPPI_BD- uruchamiany jest jako DPDK service - na service cores


![[Pasted image 20230203105104.png]]
Powyżej zdefiniowane jest kilka urządzeń #PH dedykowanych do pewnych przepłyłów trafficów/eventów:
NPA_PH_DEV_TN_PCAP_THREAD
NPA_PH_DEV_TN_PMTU_THREAD,
NPA_PH_DEV_TN_RING_THREAD
NPA_PH_DEV_TN_ETH_OAM_THREAD
Do każdego z #PH użądzeń **z wyjątkiem** #PCAP HP device, dołączany jest ingres #RL (Rate limiting) QoS queue z parametrami wyrażonych w PPS
#PH rate limiting callback is called in ADK DP context - runs on worker cores
#PH devices **Nie są priorytetyzowane między sobą** więc ich traffic też nie

![[Pasted image 20230203113437.png]]

Ten Array jest przekazywany do ADK API: **adk_ethernet_pcp_to_task_pri_map()**, następnie ADK rekonfigruje #HLP wegług IES API.
Array mapuje PCP do TC (traffic clkass).
Jest tu za hardcodowane mapowanie, decydujące, która kolejka traffiku TC jest put. TC0-Rx0, Tc1-rx1 ...
Zatem bierzące mapowanie w arrayu powyżej jest jedynym działającym.
![[Pasted image 20230203115831.png]]

![[Pasted image 20230203120030.png]]

This scenario veriyfies that rate limiting works as expectedfor given queue and that the rest of the slowpath traffic is not impacted with overload of a single queue.

Packets goes form ixia to TN port on #HLP then QAT, back to HLP, via port 20 to CPK (8queues according to traffic class) - this mechanism is tested separately in fps testking, because for fastpatch OVP prioritization based on pcp ist the main OVP mechanizm. Next the packets are pooled by #ETH_BD (in this scenario each packet type will be pulled with the same frequency because we do not use different pcps and alls slowpath patckets are whitin TN VSI). The same goes with drop threshold that will be the same for all uqeues.

Slowpath verification test basically two OVP mechanisms: rate limiting in #CPPI_BD- and rate limiting #PH that simply dorps the packets higher then expected rate for given queue (pps)

![[Pasted image 20230203134702.png]]

In this setup, the overload is performed on several queues at once to make sure that mechanism is working correctly while overloading several slowpatch queues at once.


![[Pasted image 20230203134843.png]]

![[Pasted image 20230203134900.png]]

Podstawowa konfiguracja dla wszystkich fastpathowych przypadków testowych bazuje na przeładowaniu traffic rate streams sla trafficów z pcp0-7. Maxymalny scenarusz jest testowany z kilkoma TN portami w celu sprawdzenia czy pakiety osiągające CPK  są priorytetyziwane przez pcp priority. Również, są osobne scenariusze do sprawdzenia czy priority maping działa dla VSI - setup podobny ale przez testowanie ograniczeń z ustawieńniami TNHR vlan. Uzywamy pojedyńczego portu do wysyłania trafficu z max port capacity i możemy osiągnąć dość overloadu