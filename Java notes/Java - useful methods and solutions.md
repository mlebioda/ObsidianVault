1. getLinuxTimestamp();
2. __
/** Code to get time from logs
final String command = "te log read | grep -E '" + event.getTrace() + "'";

        String linuxCliCommandOutput = linuxCliDut.send(command);

        String timeExtractedFromLine = "";

        long logLineTime;
        timeExtractedFromLine = line.substring(1, DATE_FORMAT_FOR_TE_LOG.length() + 1); 
        //private static final String DATE_FORMAT_FOR_TE_LOG = "yyyy-MM-dd HH:mm:ss.SSS";

        logLineTime = parseTimeInMillis(timeExtractedFromLine);
*/

3.  setTestStepBegin(String.format("Create %s UDP sessions", numOfUdpSessions));
   Używaj string format do składania message'ów
4. setTestInfo("<br/>"); pozwala w info zrobić nową linię
5. #saveAssertTrue - rzuca warningiem i idzie dalej