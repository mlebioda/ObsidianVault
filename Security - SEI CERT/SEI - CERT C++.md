## Do not use an additive operator on an iterator if the result would overflow
https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682

nie rób iteracji w sposób
int maxSize = 20;
for(auto i = c.begin(), e = i +20;  i!=e; ++i)

powinno być
for(auto i=c.begin(), e= i + std::min(maxsize, c.size), i!=e; ++i)

## Guarantee that storage for strings has sufficient space for character data and the null terminator
ZŁE ROZWIąZANIE
`void` `f() {`
  `char` `buf[12];`
  `std::cin >> buf;`
`}`

Złe rozwiązenie bo w bufOne działa, w kolejnej linijce std::cin.width(12) nie działa
`void` `f() {`
  `char` `bufOne[12];`
  `char` `bufTwo[12];`
  `std::cin.width(12);`
  `std::cin >> bufOne;`
 `std::cin >> bufTwo;`
`}`

POPRAWNE ROZWIĄZANIE - w C++ są stringi więc ich używać
`void` `f() {`
  `std::string input;`
  `std::string stringOne, stringTwo;`
  `std::cin >> stringOne >> stringTwo;`
`}`

NIEPOPRAWNE - istream::read nie gwarantuje /0 na końcu buffera - undefined behaviour w konstruktorze
`void` `f(std::istream &in) {`
  `char` `buffer[32];`
  `try` `{`
    `in.read(buffer,` `sizeof``(buffer));`
  `}` `catch` `(std::ios_base::failure &e) {`
    `// Handle error`
  `}`
  `std::string str(buffer);`
  `// ...`
`}`

POPRAWNE ROZWIĄZANIE
`void` `f(std::istream &in) {`
  `char` `buffer[32];`
  `try` `{`
    `in.read(buffer,` `sizeof``(buffer));`
  `}` `catch` `(std::ios_base::failure &e) {`
    `// Handle error`
  `}`
  `std::string str(buffer, in.gcount());`
  `// ...`

`}`


## # MEM53-CPP. Explicitly construct and destruct objects when manually managing object lifetime
https://wiki.sei.cmu.edu/confluence/display/cplusplus/MEM53-CPP.+Explicitly+construct+and+destruct+objects+when+manually+managing+object+lifetime
Nie używaj malloców tylko new i delete