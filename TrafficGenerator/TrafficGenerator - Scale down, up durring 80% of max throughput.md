## Test jest do [[Core scaling]] korzystający z [[Traffic generator]]

### Plan działania:
1. Wyliczyć min throughput
2. Wyliczyć max throughput korzystając z #metoda_bisekcji (potrzebny min)
3. Wyciągnąć 80% z max throughput 
4. przekazać do traffica - prawdopodobnie calculation.calculateAndSetTgTrafficRate(searchThroughputDlValue)


### Dodatkowo
Sprawdzić jak wyodrębnić throughput z searchResults do calculation.calculateAndSetTgTrafficRate(iter, searchThroughputDlValue);


Calculation - Fra