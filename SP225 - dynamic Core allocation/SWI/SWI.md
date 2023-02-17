[[Sp225]]

## General informations

---
### Notes
##### SPOTKANIE Z MAĆKIEM
Expected solution dodane zostało przez Przemka
napainitevetntdev.c VSI_DEV_TN - jak się inicjalizują vsi porty i 3 casy t, pcap, ebvom
ebcom jest w common - zastanowić się jak to zrobić żeby było w 1

w commonie zrobić enuma

Stworzyć tablicę, i korzystać zamiast zmiennej z eventdvu

DP - data plane
Nie dp_app tylko VSI_DEV_EBCOM

ebcon and pcp are swapped

array - npa_init_vsi
VSI_DEV_QUEUES - weights

wyszukaj TNS-847

init_cpk_bridge_eth - złe wagi może trzeba zamienić, a nie zmieniać na enu

test przed zmianą wag i po - ebcom
array z wagami jest updatowany jeśli plik konfiguracyjny istnieje


1. sprawdź performance 
2. komenda dosprawdzenia kolejek - sprawdzić w teście - spytać Piotra Legezińskiego
3. chce manualnie skonfigurować i sprawdzić czy się zmieniły - ETH_BD_RX_QUEUES_WEIGTHs

#### General Inforamtions
1. pcap i ebcom mają zamienione indeksy przez co są ustawiane złe wagi - trzeba poprawić niespójności
2. ETH_BD_RX_QUEUES_WEIGHTS powinna bazować na naszym wewnętrznym indeksowaniu - mechanizm translacji dla wewnętrznych indeksów nie powinien mieć dostępu do arraya eth dev id zwróconych przez ADK
3. W pliku npa_init_eventdev.c jest wprowadzająca w błąd implementacja numerowania VSI, niepowiązana z Eth Dev Id powiązanym z zarejestrowanym VSI. czyli 
   \#define VSI_DEV_TN                 (0)
   \#define VSI_DEV_PCAP               (1)
   \#define VSI_DEV_EBCOM              (2)
   Numeracja  w **npa_init_eventdev_start** jest 012 - a pcap powinien mieć 2, a ebcom 1 czyli taka jak zwrócona z adk podczas inicjalizacji VSI.
   Z  powodu tej nieścisłości, gdy Eth bridge drivers są inicjalizowane w npa_init_eventdev.c::init_bridge_eth(dev_id) - wagi dla ebcom i pcap są zamienione kolejnością gdy przekazywane są do funkcji init_cpk_bridge_eth.
   ETH_BD_RX_QUEUES_WEIGHTS - 2dim array bazuje na numerowaniu zdefiniowanym VSI_DEV_TN, VSI_DEV_PCAP, VSI_DEV_EBCO, które różnią się z numeracją ethdev.
4. Po korekcie w kierunku PCAP i EBCOM należy sprawdzić wpływ na wydajność z ruchem ebcom z testem, który przechwytuje pakiety oraz sprawdzić zakres testów OVP dla G3/G3.1
5. EXPECTED SOLUTION:
	1. Zastąp macra enumem, który znajdzie się w odpowiednim headerze, który znajdzie się w kodzie produkcyjnym i UT, z zachowaniem nazw i wartości.
	   enum vsi_dev { VSI_DEV_TN = 0, VSI_DEV_PCAP = 1, VSI_DEV_EBCOM =2 , VSI_DEV_MAX =3};
	 2. **DO PRZEGADANIA**: W pliku implementacyjnym stworzyć static global array uint vsi\[VSI_DEV_MAX] do przechowwywania vsi dev ids - zainicjalizowana 0
	 3. Zamień referencje do poprzednich makr na array z odpowienim indexem

## NOTES
1. queue_weights.conf
**update_eth_bd_rx_queues_weights_from_file**() - tworzona jest defaultowy array z predefiniowanymi wagami. następnie otwierany jest plik "/home/sirpa/dev_patches/queue_weights.conf". Jeśli go nie ma to wartości są ustawione zs tatic vsi_eth_bd_rx_queues_weights_t ETH_BD_RX_QUEUES_WEIGHTS

#### Kolejność która powinna być
TN - 0 
EBCOM - 1
PCAP - 2

### Stałe I makra do analizy
1. Stare define do usunięcia:
	\#define VSI_DEV_TN              (0)
	\#define **VSI_DEV_PCAP**          (1)
	\#define **VSI_DEV_EBCOM**       (2)
	
2. wagi do podmiany kolejności:
	**ETH_BD_RX_QUEUES_WEIGHTS** - dpme
3. **VSI_DEV_QUEUES** - do podmiany bo jest tn, pcap, ebcom - to array
4. **tempQueuesWeightsArray** - temp array wypełniony 0, jest w komentarzach dobra kolejność
5. **npa_init_eventdev_start** - pytanie czy kolejność npi_Call ma znaczeniem jeśli tak to jest poprawione - tn, ebcom, pcap
6. **uninit_bridge_eth** - też jest poprawione bo kolejność pcap, ebcom, tn
7. **print_eth_bd_rx_queues_weights** - tu jest todo w kodzie, ale tylko dla kosmetyki można podmienić kolejność w switchu. Same stałe będą podmienione enumem więc wartości się zmienią

### Funkcje potencjalnie do podmiany typu parametrów
1. **npa_init_vsi** - w npa_init_eventdev są użyte makra przy wywołaniu - definicja w npa_init_eth_dev.c, wywołania tylko w npa_init_eventdev.c, a dokładnie 3 dla każdego typu osobno - można by zrobić enume
2. npa_init_uninit_vsi - jak wyżej  init uninit xd
3. 

### Wnioski po spotkaniu z Mateuszem
1. Dane do statycznej tablicy można uzyskać z global_data.tnport - inicjalizowana powinna być w npa_init_eventdev_start zaraz po npa_init_vsi. Tablica musi być bo też ważną rolę odgrywa kolejność wykonywania czynności określaną przez enuma (wcześniej macra)
2. Wagi dla ebcoma powinny być 1111 - czyli najwyższy priorytet
3. kolejnością wag w kodzie nie ma co się sugerować bo to jest przekształcane i wykonywane prawidłowo - trzeba dostosować do nowej tablicy i dopiero przetestować wpływ na performance
4. włączyć logi com_erricsson_tn_npainit - wszystkie, ale najważniejsze API_CALL, ponieważ są w logach wywołania funckji z wartościami argumentów
5. Wartości enuma nie koniecznie w przyszłości mogą być zgodne z id więc się nimi NIE sugerować
6. Sprawdzić czy były jakieś zmiany do tr i je uwzględnić
7. potencjalny impact może być w init_cpk_bridge_eth
8. zmodyfikować init_bridge_eth, a dokładniej pętlę w sposób podobny do
   ![[Pasted image 20230208151015.png]]
   W takim przypadku wagi  będą dobierane dla odpowiedniego eth_dev
10. sprawdzić get_port_by_name
11. ustalić kolejność wykonywania funkcji
12. Sprawdzić co z innymi plikami dla ebcoma - czy wystarczy enum
13. Dowiedzieć się co ze strukturą 

#### SPOTKANIE Z PIOTREM
im wyższa waga tym dana kolejka jest częściej próbkowana - pakiety z niej szybciej będą zabierane
jest pośredni bufor w którym eventy są kolejkowane - zapobiegają przepełnienie kolejek eventów

nie możemy generowac ruchu z emki - wstrzykujemy ruch i wraca - wagi mogą zafektować na ruch powrotny
blockhal - sprawdzić konfiguracje vsi
wyciągamy device info - wiadomo ile kolejek ericcssowych

TESTY KTÓRE na ingresie wchodzi na fastpatcha i przekierowane na emke - prawdopodobnie testy z loco

tocheck  vsi_device_ebcoma
np_init_vsi - wczytywane argumenty o rx i tx kolejek VSI_DEV_QUEUES - 8 kolejek jeśli na sztywno

---
## Słownik
#VSI -
#OVP - 
#DP - dataplane

---
## TASKI
- [x] Sprawdzić gdzie jest plik, z którego są zczytywane wagi 
      "/home/sirpa/dev_patches/queue_weights.conf"
- [x] Podmień ręcznie wagi i sprawdź różnice w performance na testach przed i po skalowaniu. **wziąć pod uwagę inne parametry typu latency**
| TestName |  Old weights | new weights | 
|-|-|-|
| max throughput DL | 1548919 | 1579654 |
| max throughput UL | 862015 | 879120 |
| Avg Latency DL | 50.146000 usec | 50.540000 |
| Min Latency DL |28.475000 usec | 29.370000 |
| Max Latency DL | 94.582000 usec | 99.595000 |
| Avg Latency UL | 44.778000 usec | 44.387000 |
| Min Latency UL | 17.912000 usec | 16.895000 |
| Max Latency UL | 98.830000 usec | 106.837000 |

do pliku
1, 2, 3, 4, 5, 6, 7, 8
10, 0, 0, 0, 0, 0, 0, 0 
1, 1, 1, 1, 1, 1, 1, 1 

UWAGA! plik stworzyć na node!!!
z uprawnieniami -rw-r--r-- 1 root root   72 Feb  3 13:31 queue_weights.conf
- [ ] Sprawdź zakres testów OVP
- [x] Znajdź prezentacje OVP!!!
- [ ] Sprawdź i zanotuj miejsca z prawidłową i złą kolejnością
- [ ] Ogarnąć TODO
- [x] podmienić kolejność VSI_DEV_QUEUES
- [x] ETH_BD_RX_QUEUES_WEIGHTS -podmieniłem kolejność wag żeby ebcom - 10, a pcap -1
- [ ] Wyszukac w pozostałych plikach  czy makra i kolejności są poprawne
- [ ] Znaleźć gdzie zdefiniować enuma - proponuję npa_init_eventdev.c
- [ ] znaleźć użycia dla VSI_DEV_EBCOM
- [ ] znaleźć użycia VSI_DEV_MAX
- [ ] sprawdzić port_id_t
- [ ] sprawdzić cons_data_t : dev_id i port_id
- [ ] 
