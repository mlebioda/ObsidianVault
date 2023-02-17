https://wiki.lmera.ericsson.se/wiki/TN/TN_Tracing
1. intelowe logi     te s -l npa-init | egrep "lsi|intel" | sed 's/:.*$//g' | uniq | sed "s/ /te e '*' /g"