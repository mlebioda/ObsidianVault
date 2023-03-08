# KF4171 [G2/SSC SendGratuitousArp] No G-ARP packet found for IP address
https://eteamproject.internal.ericsson.com/browse/TNKF-4171

## Raporty
https://fem1s11-eiffel142.eiffel.gic.ericsson.se:8443/jenkins/job/tn-PL3-ssc/1693/JCAT_20Report/
https://fem1s11-eiffel142.eiffel.gic.ericsson.se:8443/jenkins/job/tn-PL3-ssc/1696/JCAT_20Report/ (rerun)
https://fem1s11-eiffel142.eiffel.gic.ericsson.se:8443/jenkins/job/tn-PL3/18999/JCAT_20Report/
https://fem1s11-eiffel142.eiffel.gic.ericsson.se:8443/jenkins/job/tn-PL3/19052/JCAT_20Report/ (rerun)

## Logs
### tn-log
[20:30:05.446934159] (+0.000007844) du1 com_ericsson_tn_sta:LAB:
{ cpu_id = 0 }, { src = "sta.c:4435", obj = "IF_IP", msg = "sti_if_send_garp(): Sending GARP: cmd=arping -U -c 1 -I evc1.1 10.91.24.66" }
[20:30:05.446938346] (+0.000004187) du1 com_ericsson_tn_sta:LAB: { cpu_id = 0 },
{ src = "sta_common.c:118", obj = "IF_IP", msg = "send_command_and_retry_on_failure(): Executing command: [arping -U -c 1 -I evc1.1 10.91.24.66]" }
[20:30:05.466848487] (+0.019910141) du1 com_ericsson_tn_sta:LAB:{ cpu_id = 0 },
{ src = "sta_common.c:123", obj = "IF_IP", msg = "send_command_and_retry_on_failure(): Command execution successful: [arping -U -c 1 -I evc1.1 10.91.24.66], return_code=0" }

## Notatki
Test twierdzi, że nie zostały wysłane garpy, a wg tn logów są wysłane






### TODO

- [ ] sprawdzić daty logów i tn-logów z garpami
- [ ] zapoznać się co robi tcpdump
- [ ] zreprodukować błąd
- [ ] zreprodukować na zrevertowanym commicie
- [ ] porównać logi z zrewertowanego i nie 