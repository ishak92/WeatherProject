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
            var realTemp = new ThreeTempStamps(nextRandTemp(), nextRandTemp(), nextRandTemp());
            var TomorrowPredict = new ThreeTempStamps(nextRandTemp(), nextRandTemp(), nextRandTemp());
            var ThreeDayPredict = new ThreeTempStamps(nextRandTemp(), nextRandTemp(), nextRandTemp());
            var SevenDayPredict = new ThreeTempStamps(nextRandTemp(), nextRandTemp(), nextRandTemp());
            var TenDayPredict = new ThreeTempStamps(nextRandTemp(), nextRandTemp(), nextRandTemp());

            return new DayliObservation(realTemp, TomorrowPredict, ThreeDayPredict, SevenDayPredict, TenDayPredict);

        }

        private int nextRandTemp()
        {
            return rand.Next(TemperatureRengeToGenerate);
        }
    }
}
