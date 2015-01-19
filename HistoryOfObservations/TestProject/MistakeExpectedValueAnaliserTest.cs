using System;
using System.Text;
using System.Collections.Generic;
using System.IO;
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
            var history = new ObservationHistory("test observation");
            var initData = new DateTime(2014, 12, 1);
            var constMistakeWeatherGenerator1 = new ConstantMistakenAndConstantRangeWeatherProvider(1, 2);  //тут фича, если дать ширину интервала нечетную, то границы интервала не удается сделать корректными,
            var constMistakeWeatherGenerator2 = new ConstantMistakenAndConstantRangeWeatherProvider(2 , 2); // так как они целое число, менять ради теста реализацию бессмысленно, ибо реальные пргнозы всегда целые

            for (int i = 0; i < 20; i=i+2)
            {
                history.AddObservation(initData.AddDays((i)), constMistakeWeatherGenerator1.GetDayliObservation());
                history.AddObservation(initData.AddDays((i+1)), constMistakeWeatherGenerator2.GetDayliObservation());
            }
            history.AddObservation(initData.AddDays((20)), constMistakeWeatherGenerator1.GetDayliObservation());
            var mistakeExpectedValue = new MistakeExpectedValueAnaliser(history);


            var oneDayPredictionMistakeExpectedValue = mistakeExpectedValue.GetMistakeExpectedValue(1);

            Assert.AreEqual(1.5, oneDayPredictionMistakeExpectedValue);
        }

        [TestMethod]
        public void YandexProviderTest()
        {
            
            var curDir = Directory.GetCurrentDirectory();
            curDir += "\\..\\..\\..\\TestData\\Yandex\\Day1\\1.html";
            var provider = new YandexWeatherProvider(curDir);
            
            var dayliObs = provider.GetDayliObservation();

            Assert.AreEqual(-1.5, dayliObs.GetRealTempOfNoon());
            Assert.AreEqual(0.5, dayliObs.GetPrediction(1).GetCenterOfInterval());
            Assert.AreEqual(0, dayliObs.GetPrediction(3).GetCenterOfInterval());
            Assert.AreEqual(-2.5, dayliObs.GetPrediction(7).GetCenterOfInterval());
            Assert.AreEqual(-5, dayliObs.GetPrediction(10).GetCenterOfInterval());


        }

        [TestMethod]
        public void MailProviderTest()
        {
            var curDir = Directory.GetCurrentDirectory();
            curDir += "\\..\\..\\..\\TestData\\Mail.ru\\Day1\\1.html";
            var provider = new MailRuWeatherProvider(curDir);

            var dayliObs = provider.GetDayliObservation();

            Assert.AreEqual(-3, dayliObs.GetRealTempOfNoon());
            Assert.AreEqual(-8, dayliObs.GetPrediction(1).GetCenterOfInterval());
            Assert.AreEqual(-14, dayliObs.GetPrediction(3).GetCenterOfInterval());
            Assert.AreEqual(-12, dayliObs.GetPrediction(7).GetCenterOfInterval());
            Assert.AreEqual(-13, dayliObs.GetPrediction(10).GetCenterOfInterval());


        }
    }
}
