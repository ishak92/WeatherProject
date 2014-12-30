using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations.Providers
{
    public class ConstantMistakenWeatherProvider: IWeatherProvider
    {
        private int _predictionMistace;
        public ConstantMistakenWeatherProvider(int mistake)
        {
            _predictionMistace = mistake;
        }

        public DayliObservation GetDayliObservation()
        {
            int realT = 10;

            var realTemp = new ThreeTempStamps(realT, realT, realT);
            var TomorrowPredict = new ThreeTempStamps(realT + _predictionMistace, realT + _predictionMistace, realT + _predictionMistace);
            var ThreeDayPredict = new ThreeTempStamps(realT + _predictionMistace, realT + _predictionMistace, realT + _predictionMistace);
            var SevenDayPredict = new ThreeTempStamps(realT + _predictionMistace, realT + _predictionMistace, realT + _predictionMistace);
            var TenDayPredict   = new ThreeTempStamps(realT + _predictionMistace, realT + _predictionMistace, realT + _predictionMistace);

            return new DayliObservation(realTemp, TomorrowPredict, ThreeDayPredict, SevenDayPredict, TenDayPredict);
        }
    }
}
