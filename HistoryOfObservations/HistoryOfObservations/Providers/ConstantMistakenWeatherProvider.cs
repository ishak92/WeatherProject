using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations.Providers
{
    public class ConstantMistakenWeatherProvider: IWeatherProvider
    {

        public DayliObservation GetDayliObservation()
        {
            int realT = 10;
            var realTemp = new ThreeTempStamps(realT, realT, realT);
            var TomorrowPredict = new ThreeTempStamps(realT+1, realT+1, realT+1);
            var ThreeDayPredict = new ThreeTempStamps(realT - 3, realT -3, realT -3);
            var SevenDayPredict = new ThreeTempStamps(realT +7, realT +7, realT +7);
            var TenDayPredict = new ThreeTempStamps(realT - 10, realT - 10, realT - 10); 

            return new DayliObservation(realTemp, TomorrowPredict, ThreeDayPredict, SevenDayPredict, TenDayPredict);
        }
    }
}
