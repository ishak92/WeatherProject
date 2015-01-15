using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HistoryOfObservations.Providers
{
    public class RandomWeatherProvider: IWeatherProvider
    {
        private int TemperatureRengeToGenerate;
        private Random rand;

        public RandomWeatherProvider(int range)
        {
            TemperatureRengeToGenerate = range;
            rand = new Random();
        }

        public DayliObservation GetDayliObservation()
        {
            var realTemp = new ThreeTempIntervalStamps(nextRandTemp(), nextRandTemp(), nextRandTemp());
            var TomorrowPredict = new ThreeTempIntervalStamps(nextRandTemp(), nextRandTemp(), nextRandTemp());
            var ThreeDayPredict = new ThreeTempIntervalStamps(nextRandTemp(), nextRandTemp(), nextRandTemp());
            var SevenDayPredict = new ThreeTempIntervalStamps(nextRandTemp(), nextRandTemp(), nextRandTemp());
            var TenDayPredict = new ThreeTempIntervalStamps(nextRandTemp(), nextRandTemp(), nextRandTemp());

            return new DayliObservation(realTemp, TomorrowPredict, ThreeDayPredict, SevenDayPredict, TenDayPredict);

        }

        private int nextRandTemp()
        {
            return rand.Next(TemperatureRengeToGenerate);
        }
    }
}
