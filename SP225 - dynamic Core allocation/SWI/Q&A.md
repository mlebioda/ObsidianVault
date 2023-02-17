[[SWI]]

## Pierwszy mail do Przemka - pytania
#### 1. Czy to musi być enum zamiast type def? 
Co to ma na celu? W argumentach są przekazywane uinty inty, pytanie czy enum negatywnie nie wpłynie

#### 2. Czy podmieniać typ parametrów/zwracany na enum
Przykładowo npa_init_vsi jest wykorzystywany tylko z EBCOM, TN i PCAP więc dla spójności argumentów można by było podmienić typ pierwszego parametru


#### 3. W opisie zadania jest podany enum, który ma pole VSI_DEV_MAX czy ma on mieć taką nazwę czy ma być zmieniona na taką jaka była używana czyli NUMBER_OF_VSI_PORTS
Nazewnictwo jest trochę mylące, ale w bierzącym kodzie jako rozmiar np tablicy z wagami, użyta jest stała NUMBER_OF_VSI_PORTS. W opisie było zanaczone, że ma być zachowane stare nazewnictwo. Pytnie jest czy dodajemy kolejną stałą i ją wykorzystujemy, czy zostaje stara.

#### 4. O co chodzi z "In implementation file, create (preferrably static) global array uint_t vsi\[VSI_DEV_MAX\] of size In implementation file, create (preferrably static) global array uint_t vsi\[VSI_DEV_MAX] of size VSI_DEV_MAX for storing VSI dev ids, initialize it with {0} for storing VSI dev ids, initialize it with {0}"
To wskazuje na to, że powinien zostać stworzony array rozmiaru VSI_DEV_MAX wstępnie wypełniony zerami, który przechowuje dev_id, do którego trzeba by się odnosić poprzed dev_id tylko reprezentowane enumem. Jaki to ma sens?
Skoro array miałby być wypełniony 0 to na jakim etapie miałbyby być przypisane poprawne Id

## 5. plik adk_qos_setup.c (on jest w build)
W pliku tym są makra
\#define DP_APP_VSI_DEV_TN         0
\#define DP_APP_VSI_DEV_TN_PACAP   1
\#define DP_APP_VSI_DEV_EBCOM      2
wartości stare, co z tym?

