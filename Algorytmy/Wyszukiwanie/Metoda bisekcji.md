Metoda ta wyszukuje najbliższą wartość z danego zakresu 
Ustalmy
1. min value - początek zakresu
2. max value - koniec zakresu
3. min step - wartość minimalna o którą dany krok musi się zmienić, żeby był sen szukać dajej.
4. max iter
Algorytm
1. z min i max określ środek - ((max - min) /2) + min
2. ewentualnie wykonaj operacje na nowej wartości
3. jeśli max bierzący numer iteracji jest równy max iter lub (max - min) < minstep to kończ pętlę zwracając wynik obliczenia