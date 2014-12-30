using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations
{
    public class DayliObservation
    {
        private ThreeTempStamps realTempOfADay;
        private ThreeTempStamps TomorrowTempPrediction;
        private ThreeTempStamps ThreeDayTempPrediction;
        private ThreeTempStamps SevenDayTempPrediction;
        private ThreeTempStamps TenDayTempPrediction;

        public DayliObservation(ThreeTempStamps realTemp, ThreeTempStamps tomorrowPredict, ThreeTempStamps threeDayPredict, ThreeTempStamps sevenDayPredict, ThreeTempStamps tenDayPredict)
        {
            realTempOfADay = realTemp;
            TomorrowTempPrediction = tomorrowPredict;
            ThreeDayTempPrediction = threeDayPredict;
            SevenDayTempPrediction = sevenDayPredict;
            TenDayTempPrediction = tenDayPredict;
        }

        public int GetRealTempOfNoon()
        {
            return realTempOfADay.NoonTemp;
        }

        public int GetPrediction(int numberOfDays)
        {
            switch (numberOfDays)
            {
                case 1:
                    return TomorrowTempPrediction.NoonTemp;
                case 3:
                    return ThreeDayTempPrediction.NoonTemp;
                case 7:
                    return SevenDayTempPrediction.NoonTemp;
                case 10:
                    return TenDayTempPrediction.NoonTemp;
            }
            throw new NoPredictionsForThisPeriod(numberOfDays);

        }
    }
}
