using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using HistoryOfObservations;
using HistoryOfObservations.Analytics;
using HistoryOfObservations.Providers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace TestProject
{
    [TestClass]
    public class MistakeExpectedValueAnaliserTest
    {
        [TestMethod]
        public void TestMethod1()
        {
            var history = new ObservationHistory();
            var initData = new DateTime(2014, 12, 1);
            var constMistakeWeatherGenerator1 = new ConstantMistakenWeatherProvider(1);
            var constMistakeWeatherGenerator2 = new ConstantMistakenWeatherProvider(2);

            for (int i = 0; i < 20; i=i+2)
            {
                history.AddObservation(initData.AddDays((i)), constMistakeWeatherGenerator1.GetDayliObservation());
                history.AddObservation(initData.AddDays((i+1)), constMistakeWeatherGenerator2.GetDayliObservation());
            }
            history.AddObservation(initData.AddDays((20)), constMistakeWeatherGenerator1.GetDayliObservation());
            var mistakeExpectedValue = new MistakeExpectedValueAnaliser(history);


            var oneDayPredictionMistakeExpectedValue = mistakeExpectedValue.GetMistakeExpectedValue(1);
            var tenDayPredictionMistakeExpectedValue = mistakeExpectedValue.GetMistakeExpectedValue(10);

            Assert.AreEqual(1.5, oneDayPredictionMistakeExpectedValue);
            Assert.AreEqual(1.5, tenDayPredictionMistakeExpectedValue);
        }
    }
}
