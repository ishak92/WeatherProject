using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations
{
    public class DayliObservation
    {
        private ThreeTempStamps _realTempOfADay;
        private ThreeTempIntervalStamps _tomorrowTempIntervalPrediction;
        private ThreeTempIntervalStamps _threeDayTempIntervalPrediction;
        private ThreeTempIntervalStamps _sevenDayTempIntervalPrediction;
        private ThreeTempIntervalStamps _tenDayTempIntervalPrediction;

        public DayliObservation(ThreeTempStamps realTempInterval, ThreeTempIntervalStamps tomorrowPredict, ThreeTempIntervalStamps threeDayPredict, ThreeTempIntervalStamps sevenDayPredict, ThreeTempIntervalStamps tenDayPredict)
        {
            _realTempOfADay = realTempInterval;
            _tomorrowTempIntervalPrediction = tomorrowPredict;
            _threeDayTempIntervalPrediction = threeDayPredict;
            _sevenDayTempIntervalPrediction = sevenDayPredict;
            _tenDayTempIntervalPrediction = tenDayPredict;
        }

        public int GetRealTempOfNoon()
        {
            return _realTempOfADay.noonTemp;
        }

        public TempInterval GetPrediction(int numberOfDays)
        {
            switch (numberOfDays)
            {
                case 1:
                    return _tomorrowTempIntervalPrediction.NoonTemp;
                case 3:
                    return _threeDayTempIntervalPrediction.NoonTemp;
                case 7:
                    return _sevenDayTempIntervalPrediction.NoonTemp;
                case 10:
                    return _tenDayTempIntervalPrediction.NoonTemp;
            }
            throw new NoPredictionsForThisPeriod(numberOfDays);

        }
    }
}
