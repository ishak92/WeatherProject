using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace HistoryOfObservations
{
    [Serializable()]
    public class DayliObservation:ISerializable
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

        public double GetRealTempOfNoon()
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

        void ISerializable.GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("_realTempOfADay",_realTempOfADay);
            info.AddValue("_tomorrowTempIntervalPrediction",_tomorrowTempIntervalPrediction);
            info.AddValue("_threeDayTempIntervalPrediction",_threeDayTempIntervalPrediction);
            info.AddValue("_sevenDayTempIntervalPrediction",_sevenDayTempIntervalPrediction);
            info.AddValue("_tenDayTempIntervalPrediction",_tenDayTempIntervalPrediction);
        }

        public DayliObservation(SerializationInfo info, StreamingContext context)
        {
            _realTempOfADay = (ThreeTempStamps) info.GetValue("_realTempOfADay", typeof (ThreeTempStamps));
            _tomorrowTempIntervalPrediction = (ThreeTempIntervalStamps) info.GetValue("_tomorrowTempIntervalPrediction",
                typeof (ThreeTempIntervalStamps));
            _threeDayTempIntervalPrediction = (ThreeTempIntervalStamps)info.GetValue("_threeDayTempIntervalPrediction",
                typeof(ThreeTempIntervalStamps));
            _sevenDayTempIntervalPrediction = (ThreeTempIntervalStamps)info.GetValue("_sevenDayTempIntervalPrediction",
                typeof(ThreeTempIntervalStamps));
            _tenDayTempIntervalPrediction = (ThreeTempIntervalStamps)info.GetValue("_tenDayTempIntervalPrediction",
                typeof(ThreeTempIntervalStamps));

        }


    }
}
