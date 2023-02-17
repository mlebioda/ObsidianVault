https://wiki.lmera.ericsson.se/wiki/TN/How_to_create_patch
1. Przejdź do lokalizacji pliku do spathowania
	1. cd build/work/dusg3/adk-falcon-3pp-swu/adk-falcon-3pp-swu-1.1.2212.121911/adk_source.falcon_transportIP/code/adk_modules/ip/src/cp
2. cp adk_ip_tables.c adk_ip_tables.c.orig   - skopiuj go
3. Zrób update pliku  
4. Zrób patch  -  diff -u .src/cp/adk_ip_tables.c.orig ./src/cp/adk_ip_tables.c > my-fix.patch
5. Przenieś plik do folderu files w tym przypadku  /local/users/eiecbml/tn-comps/blocksHal/npaInitBl/lsiAdk3ppSwU/files
6. Znajdź jakiś plik .patch i sprawdź gdzie są użycia nazwy
7. zmodyfikuj plik bb  PATCH_URI +="file://my-fix.patch"
8. zbuduj całość z -ccc albo usunięciem /build
9. wgraj soft z -ccc albo rm -rf build