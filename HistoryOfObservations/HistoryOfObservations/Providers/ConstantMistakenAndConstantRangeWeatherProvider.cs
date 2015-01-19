using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations.Providers
{
    public class ConstantMistakenAndConstantRangeWeatherProvider: IWeatherProvider
    {
        private int _predictionMistace;
        private int _range;

        public ConstantMistakenAndConstantRangeWeatherProvider(int mistake, int range)
        {
            _predictionMistace = mistake;
            _range = range;
        }

        public DayliObservation GetDayliObservation()
        {
            int realT = 10;

            var realTemp = new ThreeTempStamps(realT, realT, realT);
            var interval = createTempIntervalWithCentrRangeAndMistake(10, _range, _predictionMistace);
            var predict = new ThreeTempIntervalStamps(interval, interval, interval);
            var TomorrowPredict = predict;
            var ThreeDayPredict = predict;
            var SevenDayPredict = predict;
            var TenDayPredict   = predict;

            return new DayliObservation(realTemp, TomorrowPredict, ThreeDayPredict, SevenDayPredict, TenDayPredict);
        }

        public TempInterval createTempIntervalWithCentrRangeAndMistake(int centr, int range, int mistake)
        {
            var centerOfInterval = centr + mistake;
            return new TempInterval(centerOfInterval - range / 2, centerOfInterval + range / 2);
        }
    }
}
