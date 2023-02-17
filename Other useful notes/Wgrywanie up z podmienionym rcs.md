## Wgrywanie up z podmienionym rcs
1. wypakuj paczkę do folderu
2. plikt CXPdata.xml
	1. wyszukaj target
	   boardList hwcategory="BASEBAND-G3" hwmodel="RANP6651"
	    boardList hwcategory="BASEBAND-G3" hwmodel="RANP6651P"
	    uwaga!! mogą być 2
	2. Znajdź w tym targecie product name z RCS w nazwie
	    1. np **product name="RCSEE-EXT-G3" id="CXP2030032_2" version="R66A10" filename="RCSEE-EXT-G3_CXP2030032_2-R66A10.cxp" md5sum="46a2fbef77777144145bb31664699a56**"
	    2. skopiuj go i wklej poniżej
	    3. Wejdź na duta, i wpisz. Znajdź RCS_TEST... i skopiuj nazwę
	   ![[Pasted image 20230123130805.png]]
	    4. Wejdź w target_build_metadata_dusg3.xml dlag3![[Pasted image 20230123130842.png]]
	    5. wyszukaj skopiowaną nazwę
	       ![[Pasted image 20230123130933.png]]
	    6. Uzupełnij w xml z paczki :
		    1. name = name z target_build... bez id czyli RCSEE-TEST-G3
		    2. id = id
		    3. version - lepiej, żeby była ta sama co w pozostałych products
		    4. md5sum =
			    1. skopiuj link z path
			    2. podmień wersje na tą co ma być w produckie czyli np R66A06 na R66A10
			    3. wejdź w folder gdzie jest wypakowany cxp
			    4. wget link
			    5. md5sum nazwa cxp pobranego
			    6. skopiować hash i wkleić
		7. w configuration -> content info, jako pierwszy wpis wkleić cały utworzony tag
3.  Usunąć głównego zipa i skopiować jego nazwę
4. Zrobić zip z bierzącej paczki 
	1. zip -r nazwa paczki *
5. wgrać go na stp
	1. stp_set_up -c /local/users/eiecbml/_soft/CXP2010174_1-R66A160.zip STP_T08 -g -vvv
6. Po wpisaniu na citrixie w firefoxa ip stp można śledzić progres instalacji
	   

otwórz cxp ... .xml
kkażdy target ma osobną sekcje board list -> (są 2 dla niektórych)
wyszukać product rcs
zdubluj
/build/target/dusg3/



![[Pasted image 20230123130842.png]]

zamie3nić nazwę na ECSEE-test-g3
![[Pasted image 20230123130933.png]]


mdsum - 
wget na paczke z target_build_metadata.... do miejsca paczki
md5sum RCS....cxp
copy paste do xml z paczki

wklei 2x


caontent info te dorzuci

głównego zipa można się pozbyć, zapisać nazwę, żeby było wiadomo jaką rewizję

zip -r nazwa paczki *
-c wskazujesz zipa
- ip w firefox - zacząć od https
	- czasami najpierw zewnętrzne połączenie z siecią trzeba nawiązać
	- advanced-> accept risk
	- aicomplete.html
	- będzie walidacja paczek


less zip - wyświetl  content i znajdź rcs ee test
-c lokalizacja lokalna

